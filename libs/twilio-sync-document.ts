//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.


import {assign, isInteger} from 'lodash';
import {initClient} from './twilio-sync-token';

export const deleteSyncDocument = async (id:string): Promise<Record<string,any>> => {
    const twilioService = await initClient();
    return new Promise((resolve, reject) => {
        twilioService
            .documents(id)
            .remove()
            .then((document:Record<string,any>) => {
                resolve(document);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const createSyncDocument = async (data:Record<string,any>): Promise<Record<string,any>> => {

    const twilioService = await initClient();
    const document = assign({ data }, { uniqueName: data.id }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});
    
    return new Promise((resolve, reject) => {
        twilioService
            .documents
            .create(document)
            .then((document:Record<string,any>) => {
                resolve(document);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const retrieveSyncDocument = async (id: string) : Promise<Record<string,any>> => {

    const twilioService = await initClient();
    
    return new Promise((resolve, reject) => {
        twilioService
            .documents(id)
            .fetch()
            .then((document:Record<string,any>) => {
                resolve(document);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const updateSyncDocument = async (data:Record<string,any>): Promise<Record<string,any>> => {

    const twilioService = await initClient();
    const document = assign({ data }, { uniqueName: data.id }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});
   
    return new Promise((resolve, reject) => {
        twilioService
            .documents(data.id)
            .update(document)
            .then((document:Record<string,any>) => {
                resolve(document);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const upsertSyncDocument = async (data:Record<string,any>): Promise<Record<string,any>> => {

    if (await retrieveSyncDocument(data.id)) {
        return await updateSyncDocument(data);
    }
    else {
        return await createSyncDocument(data);
    }
};
