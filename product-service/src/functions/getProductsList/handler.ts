import 'source-map-support/register';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import { ProductService } from '../../database/services/productService';

export const getProductsList = async () => {
  console.log('Get all products request');
  try {
    const result = await new ProductService().getAllProducts();
    return formatJSONResponse(200, {products: result});
  } catch (err) {
    return formatJSONResponse(500, {
      message: err.message,
    });
  }
};

export const main = middyfy(getProductsList);
