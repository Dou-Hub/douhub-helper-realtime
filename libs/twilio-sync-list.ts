//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import { isNonEmptyString } from 'douhub-helper-util';
import { assign, isInteger } from 'lodash';
import { initClient } from './twilio-sync-token';

export const retrieveSyncList = async (id: string): Promise<Record<string, any>> => {

    const twilioService = await initClient();

    if (!isNonEmptyString(id)) throw 'The id is required.';

    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(id)
            .fetch()
            .then((list: Record<string, any>) => {
                resolve(list);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

export const deleteSyncList = async (id: string): Promise<Record<string, any>> => {
    const twilioService = await initClient();

    if (!isNonEmptyString(id)) throw 'The id is required.';

    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(id)
            .remove()
            .then((list: Record<string, any>) => {
                resolve(list);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

export const createSyncList = async (data: Record<string, any>): Promise<Record<string, any>> => {

    const twilioService = await initClient();

    if (!isNonEmptyString(data.id)) throw 'The data.id is required.';

    const list = assign({ data }, { uniqueName: data.id }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});

    return new Promise((resolve, reject) => {
        twilioService
            .syncLists
            .create(list)
            .then((list: Record<string, any>) => {
                resolve(list);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};


export const updateSyncList = async (data: Record<string, any>): Promise<Record<string, any>> => {

    const twilioService = await initClient();

    if (!isNonEmptyString(data.id)) throw 'The data.id is required.';

    const list = assign({ data }, { uniqueName: data.id }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});

    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(data.id)
            .update(list)
            .then((list: Record<string, any>) => {
                resolve(list);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

export const upsertSyncList = async (data: Record<string, any>): Promise<Record<string, any>> => {

    try {
        await retrieveSyncList(data.id);
        return await updateSyncList(data);
    }
    catch (error) {
        console.error(error);
        return await createSyncList(data);
    }
};

//Start List Item

export const retrieveSyncListItem = async (listId: string, index: number): Promise<Record<string, any>> => {

    const twilioService = await initClient();

    if (!isNonEmptyString(listId)) throw 'data.listId is required.';
    if (!isInteger(index)) throw 'data.index is required.';


    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(listId)
            .syncListItems(index)
            .fetch()
            .then((item: Record<string, any>) => {
                resolve(item);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

export const createSyncListItem = async (data: Record<string, any>): Promise<Record<string, any>> => {

    const twilioService = await initClient();
    const listId = data.listId;
    if (!isNonEmptyString(listId)) throw 'data.listId is required.';

    const item = assign({ data }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});

    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(listId)
            .syncListItems
            .create(item)
            .then((list: Record<string, any>) => {
                resolve(list);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

export const updateSyncListItem = async (data: Record<string, any>): Promise<Record<string, any>> => {

    const twilioService = await initClient();

    const listId = data.listId;
    if (!isNonEmptyString(listId)) throw 'data.listId is required.';

    const index = data.index;
    if (!isInteger(index)) throw 'data.index is required.';

    const item = assign({ data }, isInteger(data.ttl) && data.ttl > 0 ? { ttl: data.ttl } : {});

    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(listId)
            .syncListItems(index)
            .update(item)
            .then((list: Record<string, any>) => {
                resolve(list);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

export const deleteSyncListItem = async (listId: string, index: number): Promise<Record<string, any>> => {

    const twilioService = await initClient();

    if (!isNonEmptyString(listId)) throw 'The listId is required.';
    if (!isInteger(index)) throw 'The index is required.';


    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(listId)
            .syncListItems(index)
            .remove()
            .then((list: Record<string, any>) => {
                resolve(list);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
};

export const upsertSyncListItem = async (data: Record<string, any>): Promise<Record<string, any>> => {

    const listId = data.listId;
    if (!listId) throw 'The data.listId is required.';

    const index = data.index;

    try {
        if (isInteger(index)) {
            await retrieveSyncListItem(listId, index);
            return await updateSyncListItem(data);
        }
        else {
            return await createSyncListItem(data);
        }
    }
    catch (error) {
        console.error(error);
        return await createSyncListItem(data);
    }
};


export const retrieveSyncListItems = async (listId: string, pageSize?: number, fromIndex?: number, order?:string): Promise<Record<string, any>> => {

    const twilioService = await initClient();

    if (!isNonEmptyString(listId)) throw 'The listId is required.';
    if (!(pageSize && isInteger(pageSize) && pageSize > 0)) pageSize = 50;

    const params: Record<string, any> = { limit: pageSize };

    if (fromIndex && isInteger(fromIndex) && fromIndex > 0) {
        params.from = fromIndex;
        params.bounds = 'exclusive';
    }

    if (order && order=='desc') {
        params.order = order;
    }

    return new Promise((resolve, reject) => {
        twilioService
            .syncLists(listId)
            .syncListItems
            .list(params)
            .then((items: Array<Record<string, any>>) => {
                resolve(items);
            })
            .catch((error: any) => {
                reject(error);
            });
    });


};

