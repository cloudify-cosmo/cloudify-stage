import { getObjectProperty, setObjectProperty } from './propertyUtils';
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
        setObjectProperty(data, element.name, value);
    });
    return data;
};

export const bindFormData = <T extends unknown>(form: HTMLFormElement, data: T): void => {
    forEachField(form, element => {
        const value = getObjectProperty(data, element.name);
        if (element.type === 'checkbox') {
            (element as HTMLInputElement).checked = Boolean(value ?? false);
        } else {
            element.value = String(value ?? '');
        }
        dispatchEvent(element, 'input');
        dispatchEvent(element, 'change');
    });
};
