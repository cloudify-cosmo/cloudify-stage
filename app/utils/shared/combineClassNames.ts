type PossibleClassNameEntry = string | number | null | undefined | boolean;

const combineClassNames = (...classNames: (PossibleClassNameEntry | PossibleClassNameEntry[])[]) =>
    classNames.flat().filter(Boolean).join(' ');
export default combineClassNames;
