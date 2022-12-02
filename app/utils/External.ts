import { saveAs } from 'file-saver';
import 'isomorphic-fetch';
import JSZip from 'jszip';
import _ from 'lodash';
import log from 'loglevel';
import type { Http, QueryParams, RequestOptions } from 'cloudify-ui-components/toolbox';
import { LICENSE_ERR, UNAUTHORIZED_ERR } from './ErrorCodes';
import Interceptor from './Interceptor';

import StageUtils from './stageUtils';
import { getUrlWithQueryString } from '../../backend/sharedUtils';

/*
Text form of class hierarchy diagram to be used at: https://yuml.me/diagram/nofunky/class/draw

[External|doDelete();doDownload();doGet();doPatch();doPost();doPut();doUpload()]<-[Internal|]
[Internal]<-[WidgetBackend|]
[Internal]<-[Manager|doGetFull();getCurrentUsername();getCurrentUserRole();getDistributionName();getDistributionRelease();getManagerUrl();getSelectedTenant();getSystemRoles();isCommunityEdition()]

*/

function getContentType(type?: string) {
    return { 'content-type': type || 'application/json' };
}

// NOTE: Regex taken from https://stackoverflow.com/questions/23054475/javascript-regex-for-extracting-filename-from-content-disposition-header
const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
function getFilenameFromHeaders(headers: Headers, fallbackFilename: string) {
    const contentDispositionHeader = headers.get('content-disposition');

    if (contentDispositionHeader && contentDispositionHeader?.indexOf('attachment') >= 0) {
        const matches = filenameRegex.exec(contentDispositionHeader);
        if (matches?.[1]) {
            const filename = matches[1].replace(/['"]/g, '');
            return filename;
        }
    }

    return fallbackFilename;
}

export default class External implements Http {
    constructor(protected managerData: any) {}

    doGet<ResponseBody = any, RequestQueryParams extends QueryParams = QueryParams>(
        url: string,
        requestOptions?: Omit<RequestOptions<never, RequestQueryParams>, 'body'>
    ) {
        return this.ajaxCall<ResponseBody, never, RequestQueryParams>(url, 'get', requestOptions);
    }

    doPost<ResponseBody = any, RequestBody = any, RequestQueryParams extends QueryParams = QueryParams>(
        url: string,
        requestOptions?: RequestOptions<RequestBody, RequestQueryParams>
    ) {
        return this.ajaxCall<ResponseBody, RequestBody, RequestQueryParams>(url, 'post', requestOptions);
    }

    doDelete<ResponseBody = any, RequestBody = any, RequestQueryParams extends QueryParams = QueryParams>(
        url: string,
        requestOptions?: RequestOptions<RequestBody, RequestQueryParams>
    ) {
        return this.ajaxCall<ResponseBody, RequestBody, RequestQueryParams>(url, 'delete', requestOptions);
    }

    doPut<ResponseBody = any, RequestBody = any, RequestQueryParams extends QueryParams = QueryParams>(
        url: string,
        requestOptions?: RequestOptions<RequestBody, RequestQueryParams>
    ) {
        return this.ajaxCall<ResponseBody, RequestBody, RequestQueryParams>(url, 'put', requestOptions);
    }

    doPatch<ResponseBody = any, RequestBody = any, RequestQueryParams extends QueryParams = QueryParams>(
        url: string,
        requestOptions?: RequestOptions<RequestBody, RequestQueryParams>
    ) {
        return this.ajaxCall<ResponseBody, RequestBody, RequestQueryParams>(url, 'PATCH', requestOptions);
    }

    doDownload<ResponseBody = any, RequestQueryParams extends QueryParams = QueryParams>(url: string, fileName = '') {
        return this.ajaxCall<ResponseBody, never, RequestQueryParams>(url, 'get', { fileName });
    }

    doUpload<ResponseBody = any, RequestQueryParams extends QueryParams = QueryParams>(
        url: string,
        {
            params,
            files,
            method,
            parseResponse = true,
            compressFile,
            onFileUpload
        }: {
            params?: RequestQueryParams;
            files?: (Blob & { name: string }) | Record<string, any>;
            method?: string;
            parseResponse?: boolean;
            compressFile?: boolean;
            onFileUpload?: (
                file: File
            ) => string | Blob | BufferSource | FormData | URLSearchParams | Document | null | undefined;
        }
    ) {
        const actualUrl = this.buildActualUrl(url, params);

        log.debug(`Uploading file for url: ${url}`);

        return new Promise<ResponseBody>((resolve, reject) => {
            // Call upload method
            const xhr = new XMLHttpRequest();
            xhr.addEventListener('error', event => {
                log.error('xhr upload error', event, xhr.responseText);

                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        reject({ message: StageUtils.resolveMessage(response.message) });
                    } else {
                        reject({
                            message: `Cannot upload data to ${url}. For more details see the browser console.`
                        });
                    }
                } catch (err: any) {
                    log.error('Cannot parse upload error', err, xhr.responseText);
                    reject({ message: xhr.responseText || err.message });
                }
            });
            xhr.addEventListener('load', e => {
                log.debug('xhr upload complete', e, xhr.responseText);

                const isSuccess = xhr.status >= 200 && xhr.status < 300;
                let response;
                try {
                    response = parseResponse || !isSuccess ? JSON.parse(xhr.responseText) : xhr.responseText;
                    if (response.message) {
                        log.error('xhr upload error', e, xhr.responseText);

                        reject({ message: StageUtils.resolveMessage(response.message) });
                        return;
                    }
                } catch (err: any) {
                    log.error('Cannot parse upload response', err, xhr.responseText);
                    reject({ message: xhr.responseText || err.message });
                }

                resolve(response);
            });

            xhr.open(method || 'put', actualUrl);

            const headers = this.buildHeaders();
            _.forIn(headers, (value, key) => {
                xhr.setRequestHeader(key, value);
            });

            if (files) {
                if (files instanceof Blob) {
                    // Single file
                    if (compressFile) {
                        const reader = new FileReader();
                        const zip = new JSZip();

                        reader.onload = event => {
                            const { name } = files;
                            const fileContent = event.target?.result as string | ArrayBuffer;
                            zip.folder(name)?.file(name, fileContent);
                            zip.generateAsync({
                                type: 'blob',
                                compression: 'DEFLATE',
                                compressionOptions: {
                                    level: 6
                                }
                            }).then(
                                function success(blob) {
                                    const zippedFile = new File([blob], `${name}.zip`);
                                    const dataToSend = onFileUpload ? onFileUpload(zippedFile) : zippedFile;
                                    xhr.send(dataToSend);
                                },
                                function error(err) {
                                    const errorMessage = `Cannot compress file. Error: ${err}`;
                                    log.error(errorMessage);
                                    reject({ message: errorMessage });
                                }
                            );
                        };

                        reader.onerror = event => {
                            const errorMessage = `Cannot read file. Error code: ${event.target?.error?.code}`;
                            log.error(errorMessage);
                            reject({ message: errorMessage });
                        };

                        reader.readAsText(files);
                    } else {
                        const dataToSend = onFileUpload ? onFileUpload(files as File) : files;
                        xhr.send(dataToSend);
                    }
                } else {
                    const formData = new FormData();
                    _.forEach(files, (value, key) => {
                        formData.append(key, value);
                    });
                    xhr.send(formData);
                }
            } else {
                xhr.send(new FormData());
            }
        });
    }

    private ajaxCall<ResponseBody, RequestBody, RequestQueryParams extends QueryParams>(
        url: string,
        method: string,
        {
            params,
            body,
            headers = {},
            parseResponse = true,
            fileName,
            withCredentials,
            validateAuthentication = true
        }: RequestOptions<RequestBody, RequestQueryParams> & { fileName?: string } = {}
    ): Promise<ResponseBody> {
        const actualUrl = this.buildActualUrl(url, params);
        log.debug(`${method} data. URL: ${url}`);

        const options: RequestInit = {
            method,
            headers: Object.assign(this.buildHeaders(), getContentType(), headers)
        };

        if (body) {
            try {
                if (_.isString(body)) {
                    options.body = body;
                    _.merge(options.headers, getContentType('text/plain'));
                } else if (body instanceof FormData) {
                    options.body = body;
                    // NOTE: fetch library has an issue with sending data when multipart/form-data content-type is being set manually
                    // By not setting content-type, for multipart data, the browser will automatically adjust it
                    // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
                    options.headers = _.omit(options.headers, 'content-type') as RequestInit['headers'];
                } else {
                    options.body = JSON.stringify(body);
                }
            } catch (e) {
                log.error(`Error stringifying data. URL: ${actualUrl} data `, body);
            }
        }

        // this allows the server to set a cookie
        if (withCredentials) {
            options.credentials = 'include';
        }

        return fetch(actualUrl, options)
            .then(response => this.checkStatus.bind(this)(response, validateAuthentication))
            .then(response => {
                if (fileName !== undefined) {
                    const filename = getFilenameFromHeaders(response.headers, fileName);
                    return response.blob().then(blob => saveAs(blob, filename));
                }
                if (parseResponse) {
                    const contentType = _.toLower(response.headers.get('content-type') ?? undefined);
                    if (contentType.includes('application/octet-stream')) return null;
                    return response.status !== 204 && contentType.indexOf('application/json') >= 0
                        ? response.json()
                        : response.text();
                }
                return response;
            });
    }

    // Unused parameter due to override
    // eslint-disable-next-line class-methods-use-this
    protected isUnauthorized(_response: Response) {
        return false;
    }

    // Unused parameter due to override
    // eslint-disable-next-line class-methods-use-this
    protected isLicenseError(_response: Response, _body: unknown) {
        return false;
    }

    private checkStatus(response: Response, validateAuthentication: boolean) {
        if (response.ok) {
            return response;
        }

        if (validateAuthentication && this.isUnauthorized(response)) {
            const interceptor = Interceptor.getInterceptor();
            interceptor?.handle401();
            return Promise.reject(UNAUTHORIZED_ERR);
        }

        // Ignoring content type and trying to parse the json response.
        // Some errors do send json body but not the right content type (like 400 bad request)
        return response.text().then(resText => {
            try {
                const resJson = JSON.parse(resText);
                const message = StageUtils.resolveMessage(resJson.message);

                if (this.isLicenseError(response, resJson)) {
                    const interceptor = Interceptor.getInterceptor();
                    interceptor?.handleLicenseError(resJson.error_code);
                    return Promise.reject(LICENSE_ERR);
                }
                return Promise.reject({
                    message: message || response.statusText,
                    status: response.status,
                    code: resJson.error_code
                });
            } catch (e) {
                log.error(e);
                return Promise.reject({ message: response.statusText, status: response.status });
            }
        });
    }

    // eslint-disable-next-line class-methods-use-this
    protected buildActualUrl(url: string, data?: QueryParams) {
        return getUrlWithQueryString(url, data);
    }

    protected buildHeaders(): Record<string, string> {
        if (!this.managerData) {
            return {};
        }

        return { Authorization: `Basic ${this.managerData.basicAuth}` };
    }
}
