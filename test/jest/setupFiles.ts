import { TextDecoder, TextEncoder } from 'util';

export {};

// NOTE: Workaround for https://github.com/jsdom/jsdom/issues/2524
if (typeof TextEncoder !== 'undefined' && typeof TextDecoder !== 'undefined') {
    global.TextEncoder = TextEncoder;
    (global as any).TextDecoder = TextDecoder;
}
