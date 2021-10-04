import * as Handler from '../../functions/catalogBatchProcess/handler';
import * as AWSMock from 'aws-sdk-mock';
import { ProductService } from '../../database/services/productService';

jest.mock('../../database/services/productService');

describe('Test catalogBatchProcess', () => {
  const product = {
    title: 'Test',
    description: 'Super product',
    price: 100,
    count: 30
  };

  beforeEach(() => {
    // @ts-ignore
    ProductService.mockClear();
    jest.clearAllMocks();
  });

  it('Should create products and return correct response code', async () => {
    const spyProductResult = jest.spyOn(ProductService.prototype, 'createProduct')
    .mockResolvedValueOnce('123456789');

    const event = {
      Records: [
        {
          body: JSON.stringify(product),
        },
        {
          body: JSON.stringify(product),
        },
        {
          body: JSON.stringify(product),
        }
      ],
    };

    AWSMock.mock('SNS', 'publish', (_, callback) => {
      callback(undefined, 'success');
    });

    const result = await Handler.catalogBatchProcess(event);

    expect(spyProductResult).toHaveBeenCalledTimes(3);
    expect(result.statusCode).toBe(200);
  });

  it('Should return 500 status code when error occurred', async () => {
    jest.spyOn(ProductService.prototype, 'createProduct')
    .mockRejectedValue('Error');

    const event = {
      Records: [
        {
          body: JSON.stringify(product),
        },
      ],
    };

    AWSMock.mock('SNS', 'publish', (_, callback) => {
      callback(undefined, 'success');
    });

    const result = await Handler.catalogBatchProcess(event);

    expect(result.statusCode).toBe(500);
  });
});