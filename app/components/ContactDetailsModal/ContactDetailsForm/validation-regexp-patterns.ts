class ValidationRegexpPatterns {
    static isInPatternRange(pattern: string, minCharacters = 0, maxCharacters?: number) {
        // eslint-disable-next-line security/detect-non-literal-regexp
        return new RegExp(`^(${pattern}){${minCharacters},${maxCharacters || ''}}$`);
    }

    static isBetweenCharactersRange(minCharacters?: number, maxCharacters?: number): RegExp {
        return ValidationRegexpPatterns.isInPatternRange('.', minCharacters, maxCharacters);
    }

    static isBetweenDigitCharactersRange(minDigits?: number, maxDigits?: number): RegExp {
        return ValidationRegexpPatterns.isInPatternRange('\\d', minDigits, maxDigits);
    }

    static isEmail = /^\S+@\S+\.\S+$/;
}

export default ValidationRegexpPatterns;
