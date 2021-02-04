const CODE_EXP = /%([0-9A-Z]{2})/g;

const getChar = (_part, hex) => String.fromCharCode(parseInt(hex, 16));

/**
 * Helps to encode and decode base64 text with unicode support.
 * as alternative: https://www.npmjs.com/package/js-base64
 */
export default class Base64Utils {
    static encodeText = text => {
        const tmp1 = encodeURIComponent(text); // unsafe characters replaced by codes
        const tmp2 = tmp1.replace(CODE_EXP, getChar); // codes converted to characters
        return btoa(tmp2);
    };

    // static decodeBase64 = base64 => {
    //     throw new Error('Not implemented yet!')
    // };
}
