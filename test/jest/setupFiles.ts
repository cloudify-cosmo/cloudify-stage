import { TextDecoder, TextEncoder } from 'util';

// NOTE: Workaround for https://github.com/jsdom/jsdom/issues/2524
if (typeof TextEncoder !== 'undefined' && typeof TextDecoder !== 'undefined') {
    (global as any).TextEncoder = TextEncoder;
    (global as any).TextDecoder = TextDecoder;
}
