import * as Handler from '../../functions/getProductsList/handler';
import { ProductService } from '../../database/services/productService';
import Product from "../../models/Product";

jest.mock('../../database/services/productService');

describe('Test getProductsList', () => {
  test('Should return 200 status code', async () => {
    const products: Product[] = [
        {
          id: '123456',
          title: 'Test',
          description: 'Super product',
          price: 100,
          count: 30
        }
        ];
    const spyProductResult = jest.spyOn(ProductService.prototype, 'getAllProducts').mockResolvedValueOnce(products);
    const result = await Handler.getProductsList();
    expect(result.statusCode).toBe(200);
    expect(spyProductResult).toHaveBeenCalledTimes(1);
  })
});