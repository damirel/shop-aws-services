import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: 'dmf-task5',
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [
          {
            prefix: 'uploaded/'
          }
        ]
      }
    }
  ]
}