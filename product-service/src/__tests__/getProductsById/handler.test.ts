import * as Handler from '../../functions/getProductsById/handler';
import { ProductService } from '../../database/services/productService';
import Product from "../../models/Product";

jest.mock('../../database/services/productService');

describe('Test getProductsById', () => {
  beforeEach(() => {
    // @ts-ignore
    ProductService.mockClear();
    jest.clearAllMocks();
  });

  test('Should return product when correct id provided', async () => {
    const products: Product[] = [
      {
        id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
        title: 'Test',
        description: 'Deep Wrinkle Moisturizer is now Advanced Peptide and Collagen Moisturizer',
        price: 35,
        count: 100
      }
    ];
    const spyProductResult = jest.spyOn(ProductService.prototype, 'getProduct').mockResolvedValueOnce(products);
    const event = {pathParameters: {productId: '7567ec4b-b10c-48c5-9345-fc73c48a80a1'}};

    const result = await Handler.getProductsById(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({
      'product': products[0]
    }));
    expect(spyProductResult).toHaveBeenCalledTimes(1);
  });

  test('Should return 404 status code when product was not found by provided id', async () => {
    const products: Product[] = [];
    const spyProductResult = jest.spyOn(ProductService.prototype, 'getProduct').mockResolvedValueOnce(products);
    const event = {pathParameters: {productId: '3334'}};
    const result = await Handler.getProductsById(event);

    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual(JSON.stringify({message: 'Product not found. ProductId:3334'}));
    expect(spyProductResult).toHaveBeenCalledTimes(1);
  });
});