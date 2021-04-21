import { getTranslation } from '../common';

// eslint-disable-next-line import/prefer-default-export
export function getPlaceholderTranslation(key: string) {
    return getTranslation(`inputsPlaceholders.${key}`);
}
