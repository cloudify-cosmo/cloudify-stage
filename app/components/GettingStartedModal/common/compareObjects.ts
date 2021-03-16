export type Ignores<T extends unknown> = { [key in keyof T]?: Ignores<T[key]> } | true;

/**
 * Compares objects ignoring indicated properties.
 * e.g.
 * ```ts
 * // aObject and bObject are compared with omitting tenants.isFetching in both:
 * compareObjects(aObject, bObject, {
 *    tenants: {
 *        isFetching: true
 *    }
 * })
 * // aObject and bObject are compared like deep equals:
 * compareObjects(aObject, bObject
 * ```
 */
const compareObjects = <A extends unknown, B extends unknown>(a: A, b: B, ignores: Ignores<A | B>) => {
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
            const ignore = (ignores as any)[key];
            if (ignore === true) {
                return true; // we do not compare properties values, just returning true
            }
            if (key in a) {
                if (!(key in b) || !compareObjects((a as any)[key], (b as any)[key], ignore)) {
                    return false;
                }
            }
        }
        const bKeys = Object.keys(b);
        for (let i = 0; i < bKeys.length; i += 1) {
            const key = aKeys[i];
            if ((ignores as any)[key] === true) {
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
