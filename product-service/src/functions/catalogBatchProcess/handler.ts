import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { createProduct } from '../../database/services/productService';
import { getProductFromRequest } from "@libs/utils";


const catalogBatchProcess = async (event) => {
  try {
    for (const record of event.Records) {
      console.log('SQS event received:', record.body);
      const productRequest = getProductFromRequest(JSON.parse(record.body));
      console.debug('Creating product in DB:', productRequest);
      const productResult = await createProduct(productRequest);
      console.log('Product created in DB:', productResult);
    }
  } catch (error) {
    console.log(error);
  }
};

export const main = middyfy(catalogBatchProcess);
