//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.


import { getSecretValue } from 'douhub-helper-service';
const twilio = require('twilio');

export const getToken = async (userId: string) => {

    const AccessToken = twilio.jwt.AccessToken;
    const SyncGrant = AccessToken.SyncGrant;

    // Create a "grant" identifying the Sync service instance for this app.
    var syncGrant = new SyncGrant({
        serviceSid: await getSecretValue('TWILIO_SYNC_SERVICE_SID') //process.env.TWILIO_SYNC_SERVICE_SID,
    });

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created and specifying his identity.
    var token = new AccessToken(
        await getSecretValue('TWILIO_ACCOUNT_SID'),
        await getSecretValue('TWILIO_API_KEY_SID'),
        await getSecretValue('TWILIO_API_KEY_SECRET')
    );

    token.addGrant(syncGrant);
    token.identity = userId;

    return {
        identity: userId,
        token: token.toJwt()
    };
}

let twilioClientForServices:any = null;

export const initClient = async () => {
    if (!twilioClientForServices) 
    {
        const twilioClient = twilio(await getSecretValue('TWILIO_ACCOUNT_SID'), await getSecretValue('TWILIO_ACCOUNT_TOKEN'));
        const serviceId = await getSecretValue('TWILIO_SYNC_SERVICE_SID');
        twilioClientForServices = twilioClient.sync.services(serviceId);
    }
    return twilioClientForServices;
};