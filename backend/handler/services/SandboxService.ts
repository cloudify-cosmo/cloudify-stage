import * as request from './RequestService';
import manager from './ManagerService';
import { ALLOWED_METHODS_OBJECT } from '../../consts';

const catchError = (err: { message: any }, serviceName: 'request' | 'manager', method: string) =>
    `Error while reuesting ${serviceName} - ${method} - ${err.message}`;

const call = async (serviceName: 'request' | 'manager', method: string, url: string, params = '{}') => {
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
const doGet = async (serviceName: 'request' | 'manager', url: string, params: string, headers?: string) => {
    try {
        const paramsObj = JSON.parse(params);
        const headersObj = headers && JSON.parse(headers);
        const data =
            serviceName === 'manager'
                ? await manager.doGet(url, { params: paramsObj, headers: headersObj })
                : await request.doGet(url, { params: paramsObj });
        return JSON.stringify(data);
    } catch (err: any) {
        return catchError(err, serviceName, 'doGet');
    }
};
const doGetFull = async (
    _serviceName: 'request' | 'manager' = 'manager',
    url: string,
    params: string,
    headers: string,
    fullData = JSON.stringify({ items: [] }),
    size = '0'
) => {
    try {
        const paramsObj = JSON.parse(params);
        const headersObj = JSON.parse(headers);
        const data = await manager.doGetFull(
            url,
            { params: paramsObj, headers: headersObj },
            JSON.parse(fullData),
            Number(size)
        );
        return JSON.stringify(data);
    } catch (err: any) {
        return catchError(err, _serviceName, 'doGetFull');
    }
};
const doPost = async (serviceName: 'request' | 'manager', url: string, params: string, headers?: string) => {
    try {
        const paramsObj = JSON.parse(params);
        const headersObj = headers && JSON.parse(headers);
        const data =
            serviceName === 'manager'
                ? await manager.doPost(url, { params: paramsObj, headers: headersObj })
                : await request.doPost(url, { params: paramsObj });
        return JSON.stringify(data);
    } catch (err: any) {
        return catchError(err, serviceName, 'doPost');
    }
};
const doDelete = async (serviceName: 'request' | 'manager', url: string, params: string, headers?: string) => {
    try {
        const paramsObj = JSON.parse(params);
        const headersObj = headers && JSON.parse(headers);
        const data =
            serviceName === 'manager'
                ? await manager.doDelete(url, { params: paramsObj, headers: headersObj })
                : await request.doDelete(url, { params: paramsObj });
        return JSON.stringify(data);
    } catch (err: any) {
        return catchError(err, serviceName, 'doDelete');
    }
};
const doPut = async (serviceName: 'request' | 'manager', url: string, params: string, headers?: string) => {
    try {
        const paramsObj = JSON.parse(params);
        const headersObj = headers && JSON.parse(headers);
        const data =
            serviceName === 'manager'
                ? await manager.doPut(url, { params: paramsObj, headers: headersObj })
                : await request.doPut(url, { params: paramsObj });
        return JSON.stringify(data);
    } catch (err: any) {
        return catchError(err, serviceName, 'doPut');
    }
};
const doPatch = async (serviceName: 'request' | 'manager', url: string, params: string, headers?: string) => {
    try {
        const paramsObj = JSON.parse(params);
        const headersObj = headers && JSON.parse(headers);
        const data =
            serviceName === 'manager'
                ? await manager.doPatch(url, { params: paramsObj, headers: headersObj })
                : await request.doPatch(url, { params: paramsObj });
        return JSON.stringify(data);
    } catch (err: any) {
        return catchError(err, serviceName, 'doPatch');
    }
};

// list all function to be exposed to sandbox
const methodsList = ['call', 'doGet', 'doGetFull', 'doPost', 'doDelete', 'doPut', 'doPatch'];

export { methodsList, call, doGet, doGetFull, doPost, doDelete, doPut, doPatch };
