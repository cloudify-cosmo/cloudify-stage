// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck Not converted to TS yet
import _ from 'lodash';
import log from 'loglevel';
import 'isomorphic-fetch';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import StageUtils from './stageUtils';
import Interceptor from './Interceptor';
import { LICENSE_ERR, UNAUTHORIZED_ERR } from './ErrorCodes';

/*
Text form of class hierarchy diagram to be used at: https://yuml.me/diagram/nofunky/class/draw

[External|doDelete();doDownload();doGet();doPatch();doPost();doPut();doUpload()]<-[Internal|]
[Internal]<-[WidgetBackend|]
[Internal]<-[Manager|doGetFull();getCurrentUsername();getCurrentUserRole();getDistributionName();getDistributionRelease();getManagerUrl();getSelectedTenant();getSystemRoles();isCommunityEdition()]

*/

interface RequestOptions {
    params?: Record<string, any>;
    body?: any;
    headers?: Record<string, any>;
    parseResponse?: boolean;
    withCredentials?: boolean;
}

function getContentType(type?: string) {
    return { 'content-type': type || 'application/json' };
}

export default class External {
    constructor(protected managerData: any) {}

    doGet(url: string, requestOptions?: Omit<RequestOptions, 'body'>) {
        return this.ajaxCall(url, 'get', requestOptions);
    }

    doPost(url: string, requestOptions?: RequestOptions) {
        return this.ajaxCall(url, 'post', requestOptions);
    }

    doDelete(url: string, requestOptions?: RequestOptions) {
        return this.ajaxCall(url, 'delete', requestOptions);
    }

    doPut(url: string, requestOptions: RequestOptions) {
        return this.ajaxCall(url, 'put', requestOptions);
    }

    doPatch(url: string, body: Record<string, any>) {
        return this.ajaxCall(url, 'PATCH', { body });
    }

    doDownload(url: string, fileName: string) {
        return this.ajaxCall(url, 'get', { fileName });
    }

    doUpload(
        url: string,
        {
            params = {},
            files,
            method,
            parseResponse = true,
            compressFile
        }: {
            params?: Record<string, any>;
            files?: File | Record<string, any>;
            method?: string;
            parseResponse?: boolean;
            compressFile?: boolean;
        }
    ) {
        const actualUrl = this.buildActualUrl(url, params);

        log.debug(`Uploading file for url: ${url}`);

        return new Promise((resolve, reject) => {
            // Call upload method
            const xhr = new XMLHttpRequest();
            xhr.addEventListener('error', e => {
                log.error('xhr upload error', e, xhr.responseText);

                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        reject({ message: StageUtils.resolveMessage(response.message) });
                    } else {
                        // @ts-expect-error legacy solution carried from JS
                        reject({ message: e.message });
                    }
                } catch (err) {
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
                } catch (err) {
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
                if (files instanceof File) {
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
                                    xhr.send(new File([blob], `${name}.zip`));
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
                        xhr.send(files);
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

    private ajaxCall(
        url: string,
        method: string,
        {
            params,
            body,
            headers = {},
            parseResponse = true,
            fileName,
            withCredentials
        }: RequestOptions & { fileName?: string } = {}
    ) {
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

        if (fileName) {
            return fetch(actualUrl, options)
                .then(this.checkStatus.bind(this))
                .then(response => response.blob())
                .then(blob => saveAs(blob, fileName));
        }
        return fetch(actualUrl, options)
            .then(this.checkStatus.bind(this))
            .then(response => {
                if (parseResponse) {
                    const contentType = _.toLower(response.headers.get('content-type') ?? undefined);
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

    private checkStatus(response: Response) {
        if (response.ok) {
            return response;
        }

        if (this.isUnauthorized(response)) {
            const interceptor = Interceptor.getInterceptor();
            interceptor.handle401();
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
                    interceptor.handleLicenseError(resJson.error_code);
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
    protected buildActualUrl(url: string, data?: Record<string, any>) {
        // TODO: RD-258
        // @ts-ignore Cannot find $
        const queryString = data ? (url.indexOf('?') > 0 ? '&' : '?') + $.param(data, true) : '';
        return `${url}${queryString}`;
    }

    protected buildHeaders(): Record<string, string> {
        if (!this.managerData) {
            return {};
        }

        return { Authorization: `Basic ${this.managerData.basicAuth}` };
    }
}
