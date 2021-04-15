const { i18n } = Stage;
const i18nPrefix = 'widgets.common.filters.form';

// eslint-disable-next-line import/prefer-default-export
export const getTranslation = (key: string) => i18n.t(`${i18nPrefix}.${key}`);
