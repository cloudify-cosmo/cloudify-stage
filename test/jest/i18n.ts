import i18n, { TFunction, ResourceKey } from 'i18next';
import translation from 'translations/en.json';

export default function i18nInit(resource: ResourceKey): Promise<TFunction> {
    return i18n.init({
        resources: {
            en: {
                translation: resource || translation
            }
        },
        lng: 'en',
        fallbackLng: 'en'
    });
}
