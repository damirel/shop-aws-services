import 'source-map-support/register';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import {getProduct} from '../../database/services/productService';

export const getProductsById = async (event) => {
  try {
    const productId: string = event.pathParameters.productId;
    let productResult = await getProduct(productId);
    return formatJSONResponse(200, {product: productResult});
  } catch (err) {
    return formatJSONResponse(404, {
      message: err.message,
    });
  }
};

export const main = middyfy(getProductsById);
