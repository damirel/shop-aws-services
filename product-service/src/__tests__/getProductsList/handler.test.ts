import * as Handler from '../../functions/getProductsList/handler';

describe('Test getProductsList', () => {
  test('Should return 200 status code', async () => {
    const result = await Handler.getProductsList();
    expect(result.statusCode).toBe(200);
  })
});