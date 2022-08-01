import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { City, Country, State, Timezone } from '@/common/models';
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

  public async getOrCreateTimezone(timezone: Partial<Timezone>) {
    const { name } = timezone;
    let dbTimezone = await this.timezones.findOne({ name });

    if (!dbTimezone) {
      dbTimezone = await this.timezones.create(timezone);
      await this.timezones.save(dbTimezone);
    }

    return dbTimezone;
  }
}
