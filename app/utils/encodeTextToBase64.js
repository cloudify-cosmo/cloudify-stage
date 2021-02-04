const CODE_EXP = /%([0-9A-F]{2})/g;

const getChar = (_part, hex) => String.fromCharCode(parseInt(hex, 16));

/**
 * Encodes text to base64 with unicode support.
 * The main idea of the method is to escape, using native method,
 * unsafe unicode characters to 2 bytes hex codes (e.g. %A4),
 * then convert the codes back to 2 bytes characters,
 * that can be used by native btoa() method.
 * @param {*} text text that may contain any unicode characters
 * @returns base64 encoded text
 */
const encodeTextToBase64 = text => {
    const escapedText = encodeURIComponent(text);
    const convertedText = escapedText.replace(CODE_EXP, getChar);
    return btoa(convertedText);
};

export default encodeTextToBase64;
