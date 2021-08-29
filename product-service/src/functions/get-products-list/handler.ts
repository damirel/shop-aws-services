import 'source-map-support/register';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import productsListJson from '../../../productList.json';
import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';


export const findProducts = async (productsList) => {
  return await Promise.resolve(productsList);
};

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof Object> = async (event) => {
  const result = await findProducts(productsListJson);
  return formatJSONResponse(200, result)
};

export const main = middyfy(getProductsList);
