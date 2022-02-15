// eslint-disable-next-line import/prefer-default-export
export const removeHtmlTagsFromString = (value: string) => {
    return value.replace(/<\/?[^>]+(>|$)/g, '');
};
