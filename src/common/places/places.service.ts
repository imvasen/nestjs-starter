import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';

import { City, Country, State, Timezone } from '@/common/models';
import { calculateLevenshteinDistance } from '@/utils';
import { Logger } from '@/common';

@Injectable()
export class PlacesService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(Country) private countries: Repository<Country>,
    @InjectRepository(State) private states: Repository<State>,
    @InjectRepository(City) private cities: Repository<City>,
    @InjectRepository(Timezone) private timezones: Repository<Timezone>,
  ) {}

  private async fuzzySearch(
    entity: Partial<City | Country | State>,
    service: Repository<City | Country | State>,
    maxTries = 5,
  ) {
    if ('isoAlpha2' in entity) {
      const dbEntity = await service.findOne({
        where: { isoAlpha2: entity.isoAlpha2 },
      });
      return dbEntity;
    }

    let name = entity.name;
    for (let i = 0; i < maxTries; i++) {
      const dbEntities = await service.find({
        where: {
          ...entity,
          name: Like(`${name}%`),
        },
      });

      if (dbEntities.length === 1) {
        // Match!
        return dbEntities[0];
      }

      if (dbEntities.length === 0) {
        // No match... Probably because the name was too long
        const nameSplit = name.split(/[ ,]/g);
        name = nameSplit.slice(0, nameSplit.length - 1).join(' ');
      } else {
        // Multiple matches
        const distances = dbEntities.map((dbEntity) =>
          calculateLevenshteinDistance(dbEntity.name, name),
        );
        const maxDistanceIndex = distances.indexOf(Math.min(...distances));
        return dbEntities[maxDistanceIndex];
      }
    }

    return null;
  }

  public async findCity(
    partialCity: Partial<City>,
    partialState: Partial<State>,
    partialCountry: Partial<Country>,
  ) {
    const country = (await this.fuzzySearch(
      partialCountry,
      this.countries,
    )) as Country;
    const state = (await this.fuzzySearch(
      { ...partialState, country },
      this.states,
    )) as State;
    const city = (await this.fuzzySearch(
      { ...partialCity, state },
      this.cities,
    )) as City;

    if (!state || !city) {
      this.logger.warn(
        'City not found [city:' +
          `${partialCity.name},state:${partialState.name},country:${partialCountry.isoAlpha2}]`,
      );
    }

    return { country, state, city };
  }

  public async getOrCreateTimezone(timezone: Partial<Timezone>) {
    const { name } = timezone;
    let dbTimezone = await this.timezones.findOne({ where: { name } });

    if (!dbTimezone) {
      dbTimezone = await this.timezones.create(timezone);
      await this.timezones.save(dbTimezone);
    }

    return dbTimezone;
  }
}
