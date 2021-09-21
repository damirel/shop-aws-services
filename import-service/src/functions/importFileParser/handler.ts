import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk'
import * as csv from 'csv-parser'

const importFileParser = async (event) => {
  const s3 = new AWS.S3({
    region: 'eu-west-1'
  });

  event.Records.forEach(record => {
    console.log('record:' + JSON.stringify(record.s3.object.key));
    const params = {
      Bucket: 'dmf-task5',
      Key: record.s3.object.key,
    };

    const s3Stream = s3.getObject(params).createReadStream();
    s3Stream.pipe(csv())
    .on('data', (data) => {console.log(JSON.stringify(data))});
  });

  return { statusCode: 200 };
};

export const main = middyfy(importFileParser);
