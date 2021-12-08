//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.


import { getSecretValue} from 'douhub-helper-service';
import {assign, isInteger} from 'lodash';

const twilio = require('twilio');
let twilioClientForDocument:any = null;

const initClient = async () => {
    if (!twilioClientForDocument) twilioClientForDocument = twilio(await getSecretValue('TWILIO_ACCOUNT_SID'), await getSecretValue('TWILIO_ACCOUNT_TOKEN'));
};

export const deleteSyncDocument = async (id:string) => {
    await initClient();
    const serviceId = await getSecretValue('TWILIO_SYNC_SERVICE_SID');
    return new Promise((resolve, reject) => {
        twilioClientForDocument.sync.services(serviceId)
            .documents(id)
            .remove()
            .then((document:any) => {
                resolve(document);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const createSyncDocument = async (data:Record<string,any>) => {

    await initClient();
    const serviceId = await getSecretValue('TWILIO_SYNC_SERVICE_SID');
    const document = assign({ data }, { uniqueName: data.id }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});
    
    return new Promise((resolve, reject) => {
        twilioClientForDocument.sync.services(serviceId)
            .documents
            .create(document)
            .then((document:any) => {
                resolve(document);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const retrieveSyncDocument = async (id: string) => {

    await initClient();
    const serviceId = await getSecretValue('TWILIO_SYNC_SERVICE_SID');
    
    return new Promise((resolve, reject) => {
        twilioClientForDocument.sync.services(serviceId)
            .documents(id)
            .fetch()
            .then((document:any) => {
                resolve(document);
            })
            .catch((error:any) => {
                console.error({error});
                resolve(null);
            });
    });
};

export const updateSyncDocument = async (data:Record<string,any>) => {

    await initClient();
    const serviceId = await getSecretValue('TWILIO_SYNC_SERVICE_SID');
    const document = assign({ data }, { uniqueName: data.id }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});
   
    return new Promise((resolve, reject) => {
        twilioClientForDocument.sync.services(serviceId)
            .documents(data.id)
            .update(document)
            .then((document:any) => {
                resolve(document);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const upsertSyncDocument = async (data:Record<string,any>) => {

    if (await retrieveSyncDocument(data.id)) {
        return await updateSyncDocument(data);
    }
    else {
        return await createSyncDocument(data);
    }
};
