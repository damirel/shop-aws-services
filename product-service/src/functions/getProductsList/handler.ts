import 'source-map-support/register';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import {getAllProducts} from '../../database/services/productService';

export const getProductsList = async () => {
  try {
    const result = await getAllProducts();
    return formatJSONResponse(200, {products: result});
  } catch (err) {
    return formatJSONResponse(500, {
      message: err.message,
    });
  }
};

export const main = middyfy(getProductsList);
