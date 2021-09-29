import 'source-map-support/register';

import {middyfy} from '@libs/lambda';
import {formatJSONResponse} from '@libs/apiGateway';
import * as AWS from 'aws-sdk'
import csv from 'csv-parser';

const BUCKET = 'dmf-task5';
const UPLOADED_FOLDER = 'uploaded';
const PARSED_FOLDER = 'parsed';

export const processRecords = (event) => {
  const s3 = new AWS.S3({
    region: 'eu-west-1'
  });

  event.Records.forEach(record => {
    console.debug('record:' + JSON.stringify(record));
    const fileName = record.s3.object.key;
    const params = {
      Bucket: BUCKET,
      Key: record.s3.object.key,
    };

    const s3Stream = s3.getObject(params).createReadStream();

    s3Stream.pipe(csv())
    .on('data', (data) => {
      console.log(JSON.stringify(data))
    })
    .on('error', error => {
      throw new Error(`Failed to parse the file: ${error}`);
    })
    .on('end', async () => {
      console.log(`Starting moving ${fileName} from ${UPLOADED_FOLDER} to ${PARSED_FOLDER} folder`);
      await s3.copyObject({
        Bucket: BUCKET,
        CopySource: `${BUCKET}/${fileName}`,
        Key: fileName.replace(UPLOADED_FOLDER, PARSED_FOLDER),
      }).promise();
      await s3.deleteObject({
        Bucket: BUCKET,
        Key: fileName,
      }).promise();
      console.log(`File ${fileName} was moved`);
    })
  });
};

const importFileParser = async (event) => {
  try {
    processRecords(event);
    return formatJSONResponse(200, {message: 'Processed successfully'});
  } catch (e) {
    console.error('Failed to process event', e);
    return formatJSONResponse(500, {message: 'Failed to process event'});
  }
};

export const main = middyfy(importFileParser);
