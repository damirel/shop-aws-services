import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk'

import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
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

  const uploadUrl: string = await s3.getSignedUrl('putObject', params);
  return formatJSONResponse(200, {url: uploadUrl});
};

export const main = middyfy(importProductsFile);
