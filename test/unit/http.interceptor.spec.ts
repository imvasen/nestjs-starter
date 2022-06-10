import { HttpInterceptor } from '@/common/http.interceptor';

describe('HttpInterceptor', () => {
  it('should be defined', () => {
    expect(new HttpInterceptor()).toBeDefined();
  });
});
