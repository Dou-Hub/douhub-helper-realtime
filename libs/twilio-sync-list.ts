//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.


import { getSecretValue} from 'douhub-helper-service';
import {assign, isInteger} from 'lodash';


const twilio = require('twilio');
let twilioClientForList:any = null;

const initClient = async () => {
    if (!twilioClientForList) twilioClientForList = twilio(await getSecretValue('TWILIO_ACCOUNT_SID'), await getSecretValue('TWILIO_ACCOUNT_TOKEN'));
};

export const deleteSyncList = async (id:string) => {
    await initClient();
    const serviceId = await getSecretValue('TWILIO_SYNC_SERVICE_SID');
    return new Promise((resolve, reject) => {
        twilioClientForList.sync.services(serviceId)
            .syncLists(id)
            .remove()
            .then((list:any) => {
                resolve(list);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const createSyncList = async (data:Record<string,any>) => {

    await initClient();
    const serviceId = await getSecretValue('TWILIO_SYNC_SERVICE_SID');
    const list = assign({ data }, { uniqueName: data.id }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});
    
    return new Promise((resolve, reject) => {
        twilioClientForList.sync.services(serviceId)
            .syncLists
            .create(list)
            .then((list:any) => {
                resolve(list);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const retrieveSyncList = async (id:string) => {

    await initClient();
    const serviceId = await getSecretValue('TWILIO_SYNC_SERVICE_SID');
    
    return new Promise((resolve, reject) => {
        twilioClientForList.sync.services(serviceId)
            .syncLists(id)
            .fetch()
            .then((list:any) => {
                resolve(list);
            })
            .catch((error:any) => {
                console.log({error});
                resolve(null);
            });
    });
};

export const updateSyncList = async (data:Record<string,any>) => {

    await initClient();
    
    const serviceId = await getSecretValue('TWILIO_SYNC_SERVICE_SID');
    const list = assign({ data }, { uniqueName: data.id }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});
   
    return new Promise((resolve, reject) => {
        twilioClientForList.sync.services(serviceId)
            .syncLists(data.id)
            .update(list)
            .then((list:any) => {
                resolve(list);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const upsertSyncList = async (data:Record<string,any>) => {

    if (await retrieveSyncList(data.id)) {
        return await updateSyncList(data);
    }
    else {
        return await createSyncList(data);
    }
};

export const createSyncListItem = async (data:Record<string,any>) => {

    await initClient();
    const serviceId = await getSecretValue('TWILIO_SYNC_SERVICE_SID');

    const listId = data.listId;
    if (!listId) throw 'data.listId is required.';

    const item = assign({ data }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});
   
    return new Promise((resolve, reject) => {
        twilioClientForList.sync.services(serviceId)
            .syncLists(listId)
            .syncListItems
            .create(item)
            .then((list:any) => {
                resolve(list);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const updateSyncListItem = async (data:Record<string,any>) => {

    await initClient();
    const serviceId = await getSecretValue('TWILIO_SYNC_SERVICE_SID');
    const listId = data.listId;
    if (!listId) throw 'data.listId is required.';

    const index = data.index;
    if (!index) throw 'data.index is required.';

    const item = assign({ data }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});
 
    return new Promise((resolve, reject) => {
        twilioClientForList.sync.services(serviceId)
            .syncLists(listId)
            .syncListItems(index)
            .update(item)
            .then((list:any) => {
                resolve(list);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const deleteSyncListItem = async (data:Record<string,any>) => {

    await initClient();
    const serviceId = await getSecretValue('TWILIO_SYNC_SERVICE_SID');

    const listId = data.listId;
    if (!listId) throw 'data.listId is required.';

    const index = data.index;
    if (!index) throw 'data.index is required.';
   
   
    return new Promise((resolve, reject) => {
        twilioClientForList.sync.services(serviceId)
            .syncLists(listId)
            .syncListItems(index)
            .remove()
            .then((list:any) => {
                resolve(list);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};
