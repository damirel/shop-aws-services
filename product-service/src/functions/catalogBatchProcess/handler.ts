import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { createProduct } from '../../database/services/productService';
import { getProductFromRequest } from "@libs/utils";
import * as AWS from 'aws-sdk'


function publishToSns(productRequest) {
  const sns = new AWS.SNS({region: 'eu-west-1'});
  sns.publish({
    Subject: 'Product created',
    Message: JSON.stringify(productRequest),
    TopicArn: process.env.SNS_TOPIC_ARN
  }, (err) => {
    console.log('Email notification sent, for created product:', JSON.stringify(productRequest));
    if (err !== null) {
      console.error(err)
    }
  });
}

const catalogBatchProcess = async (event) => {
  try {
    for (const record of event.Records) {
      console.log('SQS event received:', record.body);
      const productRequest = getProductFromRequest(JSON.parse(record.body));
      console.debug('Creating product in DB:', productRequest);
      const productResult = await createProduct(productRequest);
      console.log('Product created in DB. ProductId:', productResult);
      publishToSns(productRequest);
    }
  } catch (error) {
    console.log(error);
  }
};

export const main = middyfy(catalogBatchProcess);
