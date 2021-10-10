import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import { ProductService } from '../../database/services/productService';
import { getProductFromRequest } from "@libs/utils";
import * as AWS from 'aws-sdk'
import { formatJSONResponse } from "@libs/apiGateway";


function publishToSns(productRequest) {
  const sns = new AWS.SNS({region: 'eu-west-1'});
  sns.publish({
    Subject: 'Product created',
    Message: JSON.stringify(productRequest),
    MessageAttributes: {
      price: {
        DataType: 'Number',
        StringValue: productRequest['price'].toString()
      },
      count: {
        DataType: 'Number',
        StringValue: productRequest['count'].toString()
      }
    },
    TopicArn: process.env.SNS_TOPIC_ARN
  }, (err) => {
    console.log('Email notification sent, for created product:', JSON.stringify(productRequest));
    if (err !== null) {
      console.error(err)
    }
  });
}

export const catalogBatchProcess = async (event) => {
  try {
    let productService = new ProductService();
    for (const record of event.Records) {
      console.log('SQS event received:', record.body);
      const productRequest = getProductFromRequest(JSON.parse(record.body));
      console.debug('Creating product in DB:', productRequest);
      const productResult = await productService.createProduct(productRequest);
      console.log('Product created in DB. ProductId:', productResult);
      publishToSns(productRequest);
    }
    return formatJSONResponse(200, { message: 'SQS even processed successfully' });
  } catch (error) {
    console.log(error);
    return formatJSONResponse(500, {
      message: error.message
    });
  }
};

export const main = middyfy(catalogBatchProcess);
