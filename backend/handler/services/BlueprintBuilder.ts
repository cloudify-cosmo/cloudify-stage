export function createIntrinsicFunctionCall(name: 'get_secret' | 'get_input' | 'get_attribute', ...args: string[]) {
    return { [name]: args };
}

export function createGetSecretCall(arg: string) {
    return createIntrinsicFunctionCall('get_secret', arg);
}

export function createGetInputCall(arg: string) {
    return createIntrinsicFunctionCall('get_input', arg);
}

export function createGetAttributeCall(...args: string[]) {
    return createIntrinsicFunctionCall('get_attribute', ...args);
}
