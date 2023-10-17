import * as request from './RequestService';
import manager from './ManagerService';
import { ALLOWED_METHODS_OBJECT } from '../../consts';

export const requestCall = async function (method: string, url: string, params = '{}') {
    const paramsObj = JSON.parse(params);
    const data = await request.call(
        ALLOWED_METHODS_OBJECT[method as keyof typeof ALLOWED_METHODS_OBJECT],
        url,
        paramsObj
    );
    return JSON.stringify(data);
};
export const requestDoGet = async function (url: string, params: string) {
    const paramsObj = JSON.parse(params);
    const data = await request.doGet(url, { params: paramsObj });
    return JSON.stringify(data);
};
export const requestDoPost = async function (url: string, params: string) {
    const paramsObj = JSON.parse(params);
    const data = await request.doPost(url, { params: paramsObj });
    return JSON.stringify(data);
};
export const requestDoDelete = async function (url: string, params: string) {
    const paramsObj = JSON.parse(params);
    const data = await request.doDelete(url, { params: paramsObj });
    return JSON.stringify(data);
};
export const requestDoPut = async function (url: string, params: string) {
    const paramsObj = JSON.parse(params);
    const data = await request.doPut(url, { params: paramsObj });
    return JSON.stringify(data);
};
export const requestDoPatch = async function (url: string, params: string) {
    const paramsObj = JSON.parse(params);
    const data = await request.doPatch(url, { params: paramsObj });
    return JSON.stringify(data);
};
// Manager
export const managerCall = async function (method: string, url: string, params = '{}') {
    const paramsObj = JSON.parse(params);
    const data = await manager.call(
        ALLOWED_METHODS_OBJECT[method as keyof typeof ALLOWED_METHODS_OBJECT],
        url,
        paramsObj
    );
    return JSON.stringify(data);
};
export const managerDoGet = async function (url: string, params: string, headers: string) {
    const paramsObj = JSON.parse(params);
    const headersObj = JSON.parse(headers);
    const data = await manager.doGet(url, { params: paramsObj, headers: headersObj });
    return JSON.stringify(data);
};
export const managerDoGetFull = async function (
    url: string,
    params: string,
    headers: string,
    fullData = JSON.stringify({ items: [] }),
    size = '0'
) {
    const paramsObj = JSON.parse(params);
    const headersObj = JSON.parse(headers);
    const data = await manager.doGetFull(
        url,
        { params: paramsObj, headers: headersObj },
        JSON.parse(fullData),
        Number(size)
    );
    return JSON.stringify(data);
};
export const managerDoPost = async function (url: string, params: string, headers: string) {
    const paramsObj = JSON.parse(params);
    const headersObj = JSON.parse(headers);
    const data = await manager.doPost(url, { params: paramsObj, headers: headersObj });
    return JSON.stringify(data);
};
export const managerDoDelete = async function (url: string, params: string, headers: string) {
    const paramsObj = JSON.parse(params);
    const headersObj = JSON.parse(headers);
    const data = await manager.doDelete(url, { params: paramsObj, headers: headersObj });
    return JSON.stringify(data);
};
export const managerDoPut = async function (url: string, params: string, headers: string) {
    const paramsObj = JSON.parse(params);
    const headersObj = JSON.parse(headers);
    const data = await manager.doPut(url, { params: paramsObj, headers: headersObj });
    return JSON.stringify(data);
};
export const managerDoPatch = async function (url: string, params: string, headers: string) {
    const paramsObj = JSON.parse(params);
    const headersObj = JSON.parse(headers);
    const data = await manager.doPatch(url, { params: paramsObj, headers: headersObj });
    return JSON.stringify(data);
};
