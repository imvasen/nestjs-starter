import * as winston from 'winston';

import * as config from '@/common/config';
import { LogLevel } from '@/common/config';

function createLogger() {
  const newLogger = winston.createLogger({
    level: config.LOG_LEVEL,
    format: winston.format.json(),
    transports: [],
  });

  if (config.NODE_ENV !== 'production') {
    newLogger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY/MM/DDThh:mm:ss' }),
          winston.format.printf(
            ({ level, message, context, meta, values, timestamp: time }) => {
              return `[ ${level.slice(
                0,
                4,
              )} @ ${time}] - ${context}: ${message}`;
            },
          ),
          winston.format.colorize({ all: true }),
        ),
      }),
    );
  }

  return newLogger;
}

const logger = createLogger();

interface LogDetails {
  message: string;
  context?: string;
  level?: LogLevel;
  meta?: { [index: string]: string };
  values?: { [index: string]: string };
}

type LogFunctionArgs = [LogDetails] | [_: string, _?: string, _?: string];

export class Logger {
  constructor(private context: string = '???') {}

  private parseArgs(args: LogFunctionArgs): LogDetails {
    let details: LogDetails;
    if (typeof args[0] === 'string') {
      details = {
        message: args[0],
        context: (args.length === 3 ? args[2] : args[1]) ?? this.context,
      };
    } else {
      details = args[0];
    }

    return { context: this.context, ...details };
  }

  public log(...args: LogFunctionArgs): void {
    const { level = LogLevel.info, ...details } = this.parseArgs(args);
    logger.log({ level, ...details });
  }

  public error(...args: LogFunctionArgs): void {
    const { level, ...details } = this.parseArgs(args);
    logger.error(details);
  }

  public warn(...args: LogFunctionArgs): void {
    const { level, ...details } = this.parseArgs(args);
    logger.warn(details);
  }

  public info(...args: LogFunctionArgs): void {
    const { level, ...details } = this.parseArgs(args);
    logger.info(details);
  }

  public http(...args: LogFunctionArgs): void {
    const { level, ...details } = this.parseArgs(args);
    logger.http(details);
  }

  public verbose(...args: LogFunctionArgs): void {
    const { level, ...details } = this.parseArgs(args);
    logger.verbose(details);
  }

  public debug(...args: LogFunctionArgs): void {
    const { level, ...details } = this.parseArgs(args);
    logger.debug(details);
  }

  public silly(...args: LogFunctionArgs): void {
    const { level, ...details } = this.parseArgs(args);
    logger.silly(details);
  }
}
