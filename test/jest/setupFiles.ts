import { TextEncoder, TextDecoder } from 'util';

// NOTE: Workaround from https://github.com/inrupt/solid-client-authn-js/issues/1676
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
