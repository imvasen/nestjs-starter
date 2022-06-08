import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { cache, typeorm } from '@/common/config';

@Module({
  imports: [CacheModule.register(cache), TypeOrmModule.forRoot(typeorm)],
})
export class CommonModule {}
