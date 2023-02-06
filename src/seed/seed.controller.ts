import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ProductsService } from '../products/products.service';

@Controller('seed')
export class SeedController {
  constructor(
    private readonly seedService: SeedService
  ) {}

  @Get()
  executeSeed(){
    return this.seedService.runSeed();
  }

}
