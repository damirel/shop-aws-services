import * as Handler from '../../functions/importProductsFile/handler';
import * as AWSMock from 'aws-sdk-mock';

describe('Test importProductsFile', () => {
  const signedUrl = 'signedUrl';
  beforeEach( async () => {
    AWSMock.mock('S3', 'getSignedUrl', signedUrl)
  });

  it('Should return correct status code and url', async () => {
    const event = {
      queryStringParameters: {
        name: 'products.csv',
      },
    };

    const result = await Handler.importProductsFile(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).url).toBe(signedUrl);
  });

  test('Should return correct status code on fail', async () => {
    AWSMock.restore('S3');
    AWSMock.mock('S3', 'getSignedUrl', () => {
      throw new Error('Failed to process event')
    });
    const event = {
      queryStringParameters: {
        name: 'products.csv',
      },
    };

    const result = await Handler.importProductsFile(event);
    expect(result.statusCode).toEqual(500)
  })
});