export function createIntrinsicFunctionCall(
    name: 'get_secret' | 'get_input' | 'get_attribute' | 'get_sys' | 'concat',
    arg: any
) {
    return { [name]: arg };
}

export function createGetSecretCall(arg: string) {
    return createIntrinsicFunctionCall('get_secret', arg);
}

export function createGetInputCall(arg: string) {
    return createIntrinsicFunctionCall('get_input', arg);
}

export function createGetAttributeCall(...args: (string | number)[]) {
    return createIntrinsicFunctionCall('get_attribute', args);
}

export function createGetSysCall(...args: string[]) {
    return createIntrinsicFunctionCall('get_sys', args);
}

export function createConcatCall(...args: string[]) {
    return createIntrinsicFunctionCall('concat', args);
}
