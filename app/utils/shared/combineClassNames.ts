// @ts-nocheck File not migrated fully to TS
/**
 * @param {(string | null | undefined | boolean)[]} classNames
 */
const combineClassNames = classNames => classNames.filter(Boolean).join(' ');
export default combineClassNames;
