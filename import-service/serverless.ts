import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';


const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              's3:ListBucket'
            ],
            Resource: 'arn:aws:s3:::dmf-task5'
          },
          {
            Effect: 'Allow',
            Action: [
              's3:GetObject', 's3:CopyObject', 's3:DeleteObject'
            ],
            Resource: 'arn:aws:s3:::dmf-task5/*'
          },
          {
            Effect: 'Allow',
            Action: [
              'sqs:*'
            ],
            Resource: '${cf:product-service-dev.SqsArn}'
          }
        ]
      }
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: '${cf:product-service-dev.SqsUrl}'
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
