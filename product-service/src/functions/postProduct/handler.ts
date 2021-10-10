import 'source-map-support/register';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import { ProductService } from '../../database/services/productService';
import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/apiGateway';
import schema from './schema';
import { getProductFromRequest } from "@libs/utils";


export const postProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log("Post product request:" + JSON.stringify(event.body));
  if (typeof (event.body) === "string") {
    return formatJSONResponse(415, {
      message: 'Unsupported media type. Please use Content-Type:application/json'
    });
  }

  try {
    const productRequest = getProductFromRequest(event.body);
    const productResult = await new ProductService().createProduct(productRequest);
    return formatJSONResponse(200, {productId: productResult});
  } catch (err) {
    return formatJSONResponse(500, {
      message: err.message,
    });
  }
};

export const main = middyfy(postProduct);


