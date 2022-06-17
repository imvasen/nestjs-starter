import { Logger, _logger } from '@/common/logger';

describe('Logger', () => {
  it('should be defined', () => {
    const logLabel = 'Custom';
    expect(new Logger()).toBeDefined();
    expect(new Logger(logLabel)).toBeDefined();
  });

  it('should log according to the level it was send', () => {
    const logger = new Logger();

    const errorSpyOn = jest.spyOn(_logger, 'error');
    errorSpyOn.mockReset();
    logger.error('Whatever');
    expect(errorSpyOn).toHaveBeenCalledTimes(1);

    const warnSpyOn = jest.spyOn(_logger, 'warn');
    warnSpyOn.mockReset();
    logger.warn('Whatever', 'What?', 'Ctx');
    expect(warnSpyOn).toHaveBeenCalledTimes(1);

    const infoSpyOn = jest.spyOn(_logger, 'info');
    infoSpyOn.mockReset();
    logger.info('Whatever');
    expect(infoSpyOn).toHaveBeenCalledTimes(1);

    infoSpyOn.mockReset();
    logger.info({ message: 'test' });
    expect(infoSpyOn).toHaveBeenCalledTimes(1);

    const httpSpyOn = jest.spyOn(_logger, 'http');
    httpSpyOn.mockReset();
    logger.http('Whatever');
    expect(httpSpyOn).toHaveBeenCalledTimes(1);

    const verboseSpyOn = jest.spyOn(_logger, 'verbose');
    verboseSpyOn.mockReset();
    logger.verbose('Whatever');
    expect(verboseSpyOn).toHaveBeenCalledTimes(1);

    const debugSpyOn = jest.spyOn(_logger, 'debug');
    debugSpyOn.mockReset();
    logger.debug('Whatever');
    expect(debugSpyOn).toHaveBeenCalledTimes(1);

    const sillySpyOn = jest.spyOn(_logger, 'silly');
    sillySpyOn.mockReset();
    logger.silly('Whatever');
    expect(sillySpyOn).toHaveBeenCalledTimes(1);

    const logSpyOn = jest.spyOn(_logger, 'log');
    logSpyOn.mockReset();
    logger.log('Whatever');
    expect(logSpyOn).toHaveBeenCalledTimes(1);
  });
});
