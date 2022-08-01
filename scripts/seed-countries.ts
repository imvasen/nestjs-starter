import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

import { getRepositoryToken } from '@nestjs/typeorm';
import { NestFactory } from '@nestjs/core';
import { Repository } from 'typeorm';
import axios from 'axios';

import { City, Country, State } from '@/common/models';
import { Logger, PlacesService } from '@/common';
import { AppModule } from '@/app.module';

const countryRepoUrl = process.env.COUNTRY_REPO_URL;

interface PlacesRepoTimezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}

interface PlacesRepoCity {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}

interface PlacesRepoState {
  id: number;
  name: string;
  state_code: string;
  latitude: string;
  longitude: string;
  type: string | null;
  cities: PlacesRepoCity[];
}

interface PlacesRepoCountry {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string; // Domain extension
  native: string; // Native name
  region: string; // Continent
  subregion: string;
  timezones: PlacesRepoTimezone[];
  translations: { [index: string]: string };
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string; // Unicode
  states: PlacesRepoState[];
}

async function retrieveCountriesFromRepository() {
  return axios
    .get<PlacesRepoCountry[]>(countryRepoUrl)
    .then(({ data: countries }) =>
      countries.map((country) => ({
        name: country.name,
        isoAlpha3: country.iso3,
        isoAlpha2: country.iso2,
        isoNumeric: country.numeric_code,
        nameNative: country.native,
        phoneCode: country.phone_code,
        capital: country.capital,
        currency: country.currency,
        currencyName: country.currency_name,
        currencySymbol: country.currency_symbol,
        flag: country.emoji,
        region: country.region,
        subregion: country.subregion,
        longitude: country.longitude,
        latitude: country.latitude,
        timezones: country.timezones,
        states: country.states.map((state) => ({
          name: state.name,
          code: state.state_code,
          type: state.type,
          longitude: state.longitude,
          latitude: state.latitude,
          cities: state.cities.map((city) => ({
            name: city.name,
            longitude: city.longitude,
            latitude: city.latitude,
          })),
        })),
      })),
    );
}

function chunk<T>(arr: T[], chunkSize: number): T[] {
  const size = Math.ceil(arr.length / chunkSize);

  return arr.reduce((acc, val, ind) => {
    const subIndex = ind % size;
    if (!Array.isArray(acc[subIndex])) {
      acc[subIndex] = [val];
    } else {
      acc[subIndex].push(val);
    }
    return acc;
  }, []);
}

async function run() {
  const logLabel = 'CountrySeeder';
  const logger = new Logger(logLabel);
  const app = await NestFactory.create(AppModule, { logger });
  const places = await app.get<PlacesService>(PlacesService);
  const countriesRepo = app.get<Repository<Country>>(
    getRepositoryToken(Country),
  );
  const statesRepo = app.get<Repository<State>>(getRepositoryToken(State));
  const citiesRepo = app.get<Repository<City>>(getRepositoryToken(City));

  logger.info('Getting countries from Remote Repository JSON');
  const countriesInRepo = await retrieveCountriesFromRepository();

  logger.info('Create timezones & process data');
  const countries = await Promise.all(
    countriesInRepo.map(async (country) =>
      countriesRepo.create({
        ...country,
        timezones: await Promise.all(
          country.timezones.map(({ zoneName: name }) =>
            places.getOrCreateTimezone({ name }),
          ),
        ),
        states: country.states.map((state) =>
          statesRepo.create({
            ...state,
            cities: state.cities.map((city) => citiesRepo.create(city)),
          }),
        ),
      }),
    ),
  );
  logger.info(`Inserting ${countries.length} countries`);
  await countriesRepo.insert(countries);

  const states = countries
    .map((country) => country.states.map((state) => ({ country, ...state })))
    .reduce((states, curState) => states.concat(curState), []);
  logger.info(`Inserting ${states.length} states`);
  await statesRepo.insert(states);

  const cities = states
    .map((state) => state.cities.map((city) => ({ state, ...city })))
    .reduce((cities, curCity) => cities.concat(curCity), []);
  logger.info(`Inserting ${cities.length} cities`);
  await Promise.all(
    chunk<City>(cities, 1000).map((chunkOfCities) =>
      citiesRepo.insert(chunkOfCities).catch((e) => {
        console.log(chunkOfCities);
        throw e;
      }),
    ),
  );

  await app.close();
}

run();
