export function isInPatternRange(pattern: string, minCharacters = 0, maxCharacters?: number) {
    // eslint-disable-next-line security/detect-non-literal-regexp
    return new RegExp(`^(${pattern}){${minCharacters},${maxCharacters || ''}}$`);
}

export function isBetweenCharactersRange(minCharacters?: number, maxCharacters?: number): RegExp {
    return isInPatternRange('.', minCharacters, maxCharacters);
}

export function isBetweenDigitCharactersRange(minDigits?: number, maxDigits?: number): RegExp {
    return isInPatternRange('\\d', minDigits, maxDigits);
}

export const emailRegexp = /^\S+@\S+\.\S+$/;
