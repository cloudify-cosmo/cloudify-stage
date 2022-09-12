import { TextDecoder, TextEncoder } from 'util';

export {};

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface Global {
            TextEncoder: typeof TextEncoder;
            TextDecoder: typeof TextDecoder;
        }
    }
}

// NOTE: Workaround for https://github.com/jsdom/jsdom/issues/2524
if (typeof TextEncoder !== 'undefined' && typeof TextDecoder !== 'undefined') {
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
}
