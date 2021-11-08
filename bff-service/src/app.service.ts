import { Injectable } from '@nestjs/common';
import { ProductsCache } from './common/productsCache';

@Injectable()
export class AppService {

  constructor(private readonly productsCache: ProductsCache) {}

  getDataFromCache() {
    return this.productsCache.products;
  }

  setCacheForData(data): void {
    console.log('Setting cache for products');
    this.productsCache.products = data;
  }
}
