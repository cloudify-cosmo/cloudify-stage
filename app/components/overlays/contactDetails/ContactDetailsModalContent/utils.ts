export const removeHtmlTagsFromString = (value: string) => {
    return value.replace(/<\/?[^>]+(>|$)/g, '');
};
