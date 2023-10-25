import * as request from './RequestService';
import manager from './ManagerService';
import { ALLOWED_METHODS_OBJECT } from '../../consts';

const catchError = (err: { message: any }, serviceName: 'request' | 'manager', method: string) =>
    `Error while reuesting ${serviceName} - ${method} - ${err.message}`;

const call = async (
    serviceName: 'request' | 'manager',
    method: keyof typeof ALLOWED_METHODS_OBJECT,
    url: string,
    params = '{}'
) => {
    try {
        const paramsObj = JSON.parse(params);
        const data =
            serviceName === 'manager'
                ? await manager.call(
                      ALLOWED_METHODS_OBJECT[method as keyof typeof ALLOWED_METHODS_OBJECT],
                      url,
                      paramsObj
                  )
                : await request.call(
                      ALLOWED_METHODS_OBJECT[method as keyof typeof ALLOWED_METHODS_OBJECT],
                      url,
                      paramsObj
                  );
        return JSON.stringify(data);
    } catch (err: any) {
        return catchError(err, serviceName, method);
    }
};
const doGet = async (serviceName: 'request' | 'manager', url: string, requestOptions: string) => {
    try {
        const parsedRO = JSON.parse(requestOptions);
        const data =
            serviceName === 'manager' ? await manager.doGet(url, parsedRO) : await request.doGet(url, parsedRO);
        return JSON.stringify(data);
    } catch (err: any) {
        return catchError(err, serviceName, 'doGet');
    }
};
const doGetFull = async (
    _serviceName: 'request' | 'manager' = 'manager',
    url: string,
    requestOptions: string,
    fullData = JSON.stringify({ items: [] }),
    size = '0'
) => {
    try {
        const parsedRO = JSON.parse(requestOptions);
        const data = await manager.doGetFull(url, parsedRO, JSON.parse(fullData), Number(size));
        return JSON.stringify(data);
    } catch (err: any) {
        return catchError(err, _serviceName, 'doGetFull');
    }
};
const doPost = async (serviceName: 'request' | 'manager', url: string, requestOptions: string) => {
    try {
        const parsedRO = JSON.parse(requestOptions);
        const data =
            serviceName === 'manager' ? await manager.doPost(url, parsedRO) : await request.doPost(url, parsedRO);
        return JSON.stringify(data);
    } catch (err: any) {
        return catchError(err, serviceName, 'doPost');
    }
};
const doDelete = async (serviceName: 'request' | 'manager', url: string, requestOptions: string) => {
    try {
        const parsedRO = JSON.parse(requestOptions);
        const data =
            serviceName === 'manager' ? await manager.doDelete(url, parsedRO) : await request.doDelete(url, parsedRO);
        return JSON.stringify(data);
    } catch (err: any) {
        return catchError(err, serviceName, 'doDelete');
    }
};
const doPut = async (serviceName: 'request' | 'manager', url: string, requestOptions: string) => {
    try {
        const parsedRO = JSON.parse(requestOptions);
        const data =
            serviceName === 'manager' ? await manager.doPut(url, parsedRO) : await request.doPut(url, parsedRO);
        return JSON.stringify(data);
    } catch (err: any) {
        return catchError(err, serviceName, 'doPut');
    }
};
const doPatch = async (serviceName: 'request' | 'manager', url: string, requestOptions: string) => {
    try {
        const parsedRO = JSON.parse(requestOptions);
        const data =
            serviceName === 'manager' ? await manager.doPatch(url, parsedRO) : await request.doPatch(url, parsedRO);
        return JSON.stringify(data);
    } catch (err: any) {
        return catchError(err, serviceName, 'doPatch');
    }
};

// list all function to be exposed to sandbox
const methodsList = ['call', 'doGet', 'doGetFull', 'doPost', 'doDelete', 'doPut', 'doPatch'];

export { methodsList, call, doGet, doGetFull, doPost, doDelete, doPut, doPatch };
