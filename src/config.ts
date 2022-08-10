import * as redisStore from 'cache-manager-redis-store';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CacheModuleOptions } from '@nestjs/common';
import { config as dotEnvConfig } from 'dotenv';
import { JwtModuleOptions } from '@nestjs/jwt';

dotEnvConfig();

export const DEFAULT_PORT = 3000;

function getPort(port = Number(process.env.PORT)): number {
  return port > 0 && port < 65536 ? port : DEFAULT_PORT;
}

export const PORT = getPort();

const secret = process.env.SECRET || 'Secret';

export const jwtOpts: JwtModuleOptions = { secret };

export const ENV: string = (() => {
  const env: string = process.env.NODE_ENV;
  return ['test', 'development', 'production'].includes(env)
    ? env
    : 'development';
})();

export const LOG_LEVEL = process.env.LOG_LEVEL;
export const NODE_ENV = process.env.NODE_ENV ?? 'development';

export const cache: CacheModuleOptions = {
  isGlobal: true,
  ttl: 10 * 60,
  ...(process.env.REDIS_HOST
    ? {
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        auth_pass: process.env.REDIS_PASSWORD,
      }
    : {}),
};

export const typeorm: TypeOrmModuleOptions = {
  autoLoadEntities: true,
  verboseRetryLog: true,
  synchronize: true,
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
};

export const GEO_LOCATION_API_URL = 'https://api.geoapify.com/v1/ipinfo';
export const GEO_LOCATION_API_KEY = process.env.GEO_LOCATION_API_KEY;
