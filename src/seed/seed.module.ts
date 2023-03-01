import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [SeedController],
  imports: [
    ProductsModule,
    AuthModule
  ],
  providers: [SeedService, AuthService]
})
export class SeedModule {}
