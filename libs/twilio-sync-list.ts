//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import {assign, isInteger} from 'lodash';
import {initClient} from './twilio-sync-token';


export const retrieveSyncList = async (id:string): Promise<Record<string,any>> => {

    const twilioService = await initClient();
    
    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(id)
            .fetch()
            .then((list:Record<string,any>) => {
                resolve(list);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const deleteSyncList = async (id:string): Promise<Record<string,any>> => {
    const twilioService = await initClient();
    
    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(id)
            .remove()
            .then((list:Record<string,any>) => {
                resolve(list);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const createSyncList = async (data:Record<string,any>): Promise<Record<string,any>> => {

    const twilioService = await initClient();
    
    const list = assign({ data }, { uniqueName: data.id }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});
    
    return new Promise((resolve, reject) => {
        twilioService
            .syncLists
            .create(list)
            .then((list:Record<string,any>) => {
                resolve(list);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};


export const updateSyncList = async (data:Record<string,any>): Promise<Record<string,any>> => {

    const twilioService = await initClient();
    
    const list = assign({ data }, { uniqueName: data.id }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});
   
    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(data.id)
            .update(list)
            .then((list:Record<string,any>) => {
                resolve(list);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const upsertSyncList = async (data:Record<string,any>): Promise<Record<string,any>> => {

    if (await retrieveSyncList(data.id)) {
        return await updateSyncList(data);
    }
    else {
        return await createSyncList(data);
    }
};

//Start List Item

export const retrieveSyncListItem = async (listId:string , index: number): Promise<Record<string,any>> => {

    const twilioService = await initClient();

    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(listId)
            .syncListItems(index)
            .fetch()
            .then((item:Record<string,any>) => {
                resolve(item);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const createSyncListItem = async (data:Record<string,any>): Promise<Record<string,any>> => {

    const twilioService = await initClient();
    

    const listId = data.listId;
    if (!listId) throw 'data.listId is required.';

    const item = assign({ data }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});
   
    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(listId)
            .syncListItems
            .create(item)
            .then((list:Record<string,any>) => {
                resolve(list);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const updateSyncListItem = async (data:Record<string,any>): Promise<Record<string,any>> => {

    const twilioService = await initClient();
    
    const listId = data.listId;
    if (!listId) throw 'data.listId is required.';

    const index = data.index;
    if (!index) throw 'data.index is required.';

    const item = assign({ data }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});
 
    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(listId)
            .syncListItems(index)
            .update(item)
            .then((list:Record<string,any>) => {
                resolve(list);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const deleteSyncListItem = async (data:Record<string,any>): Promise<Record<string,any>> => {

    const twilioService = await initClient();

    const listId = data.listId;
    if (!listId) throw 'data.listId is required.';

    const index = data.index;
    if (!index) throw 'data.index is required.';
   
   
    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(listId)
            .syncListItems(index)
            .remove()
            .then((list:Record<string,any>) => {
                resolve(list);
            })
            .catch((error:any) => {
                reject(error);
            });
    });
};

export const upsertSyncListItem = async (data:Record<string,any>): Promise<Record<string,any>> => {

    const listId = data.listId;
    if (!listId) throw 'data.listId is required.';

    const index = data.index;
    if (!index) throw 'data.index is required.';
   

    if (await retrieveSyncListItem(listId, index)) {
        return await updateSyncListItem(data);
    }
    else {
        return await createSyncList(data);
    }
};

