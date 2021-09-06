import 'source-map-support/register';
import {formatJSONResponse} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import productsListJson from '../../../productList.json';

export const findProduct = async (productId: string, productsListJson) => {
  const productsList = await Promise.resolve(productsListJson);
  let productResult;
  productsList.forEach((element) => {
    if (element.id == productId) {
      productResult = element;
    }
  });
  if (productResult == null) {
    throw new Error('Product not found. Product id:' + productId);
  }
  return productResult;
};

export const getProductsById = async (event) => {
  try {
    const productId: string = event.pathParameters.productId;
    let productResult = await findProduct(productId, productsListJson);
    return formatJSONResponse(200, productResult);
  } catch (err) {
    return formatJSONResponse(404, {
      message: err.message,
    });
  }
};

export const main = middyfy(getProductsById);
