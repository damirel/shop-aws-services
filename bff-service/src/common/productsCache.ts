import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsCache {
  private cacheExpiration = 2 * 60 * 1000;
  private cachedProducts;
  private cachedTime = 0;

  set products(products) {
    this.cachedProducts = products;
    this.cachedTime = new Date().getTime();
  }

  get products() {
    if (this.isCacheExpired()) {
      this.cachedProducts = undefined;
      this.cachedTime = 0;
    }
    return this.cachedProducts;
  }

  isCacheExpired(): boolean {
    const now = new Date().getTime();
    return !!(this.cachedProducts && now - this.cachedTime > this.cacheExpiration);
  }
}