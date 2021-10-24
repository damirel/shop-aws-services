import 'source-map-support/register';

import { middyfy } from '@libs/lambda';


const basicAuthorizer = async (event, _ctx, cb) => {
  console.log("Incoming event. Event:", JSON.stringify(event));

  if (event['type'] !== 'TOKEN') {
    cb('Unauthorized');
  }

  try {
    const authorizationToken = event.authorizationToken;
    const credentials = authorizationToken.split(' ')[1];
    const [login, password] = Buffer.from(credentials, 'base64').toString('utf-8').split(':');
    console.log(`Login and password decoded. Login:${login}, password:${password}`);

    const validPassword = process.env[login];
    console.debug('Valid password:', validPassword);

    const effect = !validPassword || validPassword != password ? 'Deny' : 'Allow';
    const policy = generatePolicy(credentials, event.methodArn, effect);
    cb(null, policy);
  } catch (e) {
    console.error('Error processing event', e);
    cb(`Unauthorized: ${e.message}`);
  }
};

const generatePolicy = (principalId, resource, effect = 'Allow') => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    },
  };
};

export const main = middyfy(basicAuthorizer);
