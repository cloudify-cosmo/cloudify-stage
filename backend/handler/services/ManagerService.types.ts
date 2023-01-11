import type { AxiosPromise } from 'axios';
import type { QueryStringParams } from '../../sharedUtils';
import type { AllowedRequestMethod } from '../../types';

interface RequestOptions {
    body?: any;
    headers?: Record<string, string>;
    params?: QueryStringParams;
    timeout?: number;
}

export type ManagerResponse = { items: any[] };

export interface ManagerService {
    call(method: AllowedRequestMethod, url: string, requestOptions: RequestOptions): AxiosPromise<any>;
    doGet(url: string, requestOptions: RequestOptions): AxiosPromise<any>;
    doGetFull(
        url: string,
        requestOptions?: RequestOptions,
        fullData?: ManagerResponse,
        size?: number
    ): Promise<ManagerResponse>;
    doPost(url: string, requestOptions: RequestOptions): AxiosPromise<any>;
    doDelete(url: string, requestOptions: RequestOptions): AxiosPromise<any>;
    doPut(url: string, requestOptions: RequestOptions): AxiosPromise<any>;
    doPatch(url: string, requestOptions: RequestOptions): AxiosPromise<any>;
}
