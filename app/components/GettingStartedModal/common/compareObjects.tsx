export type Ignores = { [key: string]: Ignores } | true;

/**
 * Compares objects ignoring indicated properties.
 * e.g.
 * // aObject and bObject are compared with omitting tenants.isFetching in both:
 *   compareObjects(aObject, bObject, {
 *      tenants: {
 *          isFetching: true
 *      }
 *   })
 * // aObject and bObject are compared like deep equals:
 *   compareObjects(aObject, bObject
 */
const compareObjects = (a: any, b: any, ignores: Ignores = {}) => {
    if (ignores === true) {
        return true; // we do not compare properties values, just returning true
    }
    if (a === b) {
        return true;
    }
    if (a instanceof Object && b instanceof Object) {
        if (a.constructor !== b.constructor) {
            return false;
        }
        const aKeys = Object.keys(a);
        for (let i = 0; i < aKeys.length; i += 1) {
            const key = aKeys[i];
            const ignore = ignores[key];
            if (ignore === true) {
                return true; // we do not compare properties values, just returning true
            }
            if (key in a) {
                if (!(key in b) || !compareObjects(a[key], b[key], ignore)) {
                    return false;
                }
            }
        }
        const bKeys = Object.keys(b);
        for (let i = 0; i < bKeys.length; i += 1) {
            const key = aKeys[i];
            if (ignores[key] === true) {
                return true; // we do not compare properties values, just returning true
            }
            if (key in b && !(key in a)) {
                return false;
            }
        }
        return true;
    }
    return false;
};

export default compareObjects;
