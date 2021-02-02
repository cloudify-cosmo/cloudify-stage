/**
 * @param {(string | null | undefined | boolean)[]} classNames
 */
const combineClassNames = classNames => classNames.filter(Boolean).join(' ');
export default combineClassNames;
