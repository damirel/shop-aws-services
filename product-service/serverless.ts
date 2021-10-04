import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import postProduct from '@functions/postProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  useDotenv: true,
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
              'sqs:*'
            ],
            Resource: { 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] }
          },
          {
            Effect: 'Allow',
            Action: [
              'sns:*'
            ],
            Resource: { 'Ref': 'createProductTopic' }
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
      PG_HOST: '${env:PG_HOST}',
      PG_PORT: '${env:PG_PORT}',
      PG_DATABASE: '${env:PG_DATABASE}',
      PG_USERNAME: '${env:PG_USERNAME}',
      PG_PASSWORD: '${env:PG_PASSWORD}',
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        }
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        }
      },
      snsSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:SNS_EMAIL}',
          Protocol: 'email',
          TopicArn: { 'Ref': 'createProductTopic' },
        }
      }
    },
    Outputs: {
      SqsArn: {
        Value: { 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] },
        Export: {
          Name: 'catalogItemsQueueArn'
        }
      },
      SqsUrl: {
        Value: { 'Ref': 'catalogItemsQueue' },
        Export: {
          Name: 'catalogItemsQueueUrl'
        }
      }
    }
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, postProduct, catalogBatchProcess },
};

module.exports = serverlessConfiguration;
