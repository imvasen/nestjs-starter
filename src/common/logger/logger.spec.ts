import { Logger } from '@/common';

describe('Logger', () => {
  it('should be defined', () => {
    expect(new Logger('custom')).toBeDefined();
  });
});
