import 'source-map-support/register';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import {createProduct} from '../../database/services/productService';
import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import schema from './schema';

export const getProductFromRequest = (event) => {
  const {title, description, price, count} = event.body;
  return {
    title: title,
    description: description,
    price: price,
    count: count
  };
};

export const postProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log("Post product request:" + JSON.stringify(event.body));
  if (typeof (event.body) === "string") {
    return formatJSONResponse(415, {
      message: 'Unsupported media type. Please use Content-Type:application/json'
    });
  }
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


