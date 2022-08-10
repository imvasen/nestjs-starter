import { JwtModuleOptions } from '@nestjs/jwt';

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
