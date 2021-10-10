import { handlerPath } from '../../../../import-service/src/libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: { 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] },
        batchSize: 5,
      }
    }
  ]
}