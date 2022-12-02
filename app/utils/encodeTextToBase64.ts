const codeExpression = /%([0-9A-F]{2})/g;

const getChar = (_part: string, hex: string) => String.fromCharCode(parseInt(hex, 16));

/**
 * Encodes text to base64 with unicode support.
 * The main idea of the function is to escape, using native function,
 * unsafe unicode characters to 2 bytes hex codes (e.g. %A4),
 * then convert the codes back to 2 bytes characters,
 * that can be used by native btoa() function.
 * @param {string} text text that may contain any unicode characters
 * @returns base64 encoded text
 */
const encodeTextToBase64 = (text: string) => {
    const escapedText = encodeURIComponent(text);
    const convertedText = escapedText.replace(codeExpression, getChar);
    return btoa(convertedText);
};

export default encodeTextToBase64;
