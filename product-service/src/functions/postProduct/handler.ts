import 'source-map-support/register';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import {createProduct} from '../../database/services/productService';

export const getProductFromRequest = (event) => {
  const {title, description, price, count} = JSON.parse(event.body);
  return {
    title: title,
    description: description,
    price: price,
    count: count
  };
};

export const postProduct = async (event) => {
  const productRequest = getProductFromRequest(event);
  try {
    const productResult = await createProduct(productRequest);
    return formatJSONResponse(200, {productId: productResult});
  } catch (err) {
    return formatJSONResponse(400, {
      message: err.message,
    });
  }
};

export const main = middyfy(postProduct);


