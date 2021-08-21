import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import productList from '../../../productList.json';


import schema from './schema';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
        productList
    ),
  };
}

export const main = middyfy(getProductsList);
