import 'source-map-support/register';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import {getProduct} from '../../database/services/productService';

export const getProductsById = async (event) => {
  try {
    const productId: string = event.pathParameters.productId;
    let productResult = await getProduct(productId);
    if (!productResult.length) {
      return formatJSONResponse(404, {
        message: 'Product not found. ProductId:' + productId
      });
    }
    return formatJSONResponse(200, {product: productResult[0]});
  } catch (err) {
    return formatJSONResponse(500, {
      message: err.message,
    });
  }
};

export const main = middyfy(getProductsById);
