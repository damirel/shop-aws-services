import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsCache } from './common/productsCache';
import config from './common/config';

@Module({
  imports: [
      ConfigModule.forRoot({
        load: [config],
  })],
  controllers: [AppController],
  providers: [AppService, ProductsCache],
})
export class AppModule {}
