import _ from 'lodash';

import dispatchEvent from './dispatchEvent';

export type HTMLFieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export const forEachField = (form: HTMLFormElement, callback: (element: HTMLFieldElement) => void) => {
    const { elements } = form;
    for (let i = 0; i < elements.length; i += 1) {
        const element = elements[i] as HTMLFieldElement;
        if (element.name) {
            callback(element);
        }
    }
};

export const getFormData = <T extends unknown>(form: HTMLFormElement): T => {
    const data = {} as T;
    forEachField(form, element => {
        const value = element.type === 'checkbox' ? (element as HTMLInputElement).checked : element.value;
        _.set(data as any, element.name, value);
    });
    return data;
};

export const bindFormData = <T extends unknown>(form: HTMLFormElement, data: T): void => {
    forEachField(form, element => {
        const value = _.get(data, element.name);
        if (element.type === 'checkbox') {
            (element as HTMLInputElement).checked = Boolean(value ?? false);
        } else {
            element.value = String(value ?? '');
        }
        dispatchEvent(element, 'input');
        dispatchEvent(element, 'change');
    });
};
