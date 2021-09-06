import * as Handler from '../../functions/getProductsById/handler';

describe('Test getProductsById', () => {
  test('Should return product when correct id provided', async () => {
    const event = {pathParameters: {productId: '7567ec4b-b10c-48c5-9345-fc73c48a80a1'}};

    const productResult = {
      "count": 100,
      "description": "Deep Wrinkle Moisturizer is now Advanced Peptide and Collagen Moisturizer",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
      "price": 35,
      "title": "Advanced Peptides and Collagen Moisturizer"
    };

    const result = await Handler.getProductsById(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(productResult));
  });

  test('Should return 404 status code when product was not found by provided id', async () => {
    const event = {pathParameters: {productId: '3334'}};
    const result = await Handler.getProductsById(event);

    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual(JSON.stringify({message: 'Product not found. Product id:3334'}));
  });
});