import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import productList from '../../../productList.json';


import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const productId: string = event.pathParameters.productId;
    let productResult = getProduct(productId);
    return formatJSONResponse(productResult);
  } catch (err) {
    return formatJSONResponse({
      statusCode: 404,
      message: err.message,
    });
  }
};

function getProduct(productId: string) {
  if (!productId) {
    return formatJSONResponse({
      statusCode: 400,
      message: 'Missing productId param',
    });
  }
  let productResult;
  productList.forEach((element) => {
    if (element.id == productId) {
      productResult = element;
    }
  });
  if (productResult == null) {
    throw new Error('Product not found! Product id:' + productId);
  }
  return productResult;
}

export const main = middyfy(getProductsById);
