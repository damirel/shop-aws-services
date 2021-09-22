import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk'

import schema from './schema';

export const getSignedUrl = async (event) => {
  const s3 = new AWS.S3({
    region: 'eu-west-1'
  });
  const BUCKET = 'dmf-task5';
  const catalogPath = `uploaded/${event.queryStringParameters.name}`;
  const params = {
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 60,
    ContentType: 'text/csv'
  };

  const uploadUrl: string = await s3.getSignedUrlPromise('putObject', params);
  console.debug(`Signed url: ${uploadUrl}`);
  return uploadUrl;
};

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const uploadUrl = await getSignedUrl(event);
    return formatJSONResponse(200, {url: uploadUrl});
  } catch (e) {
    console.error('Failed to process event', e);
    return formatJSONResponse(500, {message: 'Failed to process event'});
  }
};

export const main = middyfy(importProductsFile);
