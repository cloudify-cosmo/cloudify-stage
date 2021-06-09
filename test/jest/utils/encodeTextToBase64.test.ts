import encodeTextToBase64 from 'utils/encodeTextToBase64';

describe('(Utils) encodeTextToBase64', () => {
    it('encode Latin, Hebrew, Cyrillic, Japanese, unicode characters, etc.', () => {
        expect(encodeTextToBase64('Only english letters...')).toBe('T25seSBlbmdsaXNoIGxldHRlcnMuLi4=');
        expect(encodeTextToBase64('צֶבַע')).toBe('16bWtteR1rfXog==');
        expect(encodeTextToBase64('Россия')).toBe('0KDQvtGB0YHQuNGP');
        expect(encodeTextToBase64('Żółty')).toBe('xbvDs8WCdHk=');
        expect(encodeTextToBase64('日本')).toBe('5pel5pys');
        expect(encodeTextToBase64('Fuß')).toBe('RnXDnw==');
        expect(encodeTextToBase64('(◑‿◑)┏🍟--🍔┑(^◡^)')).toBe('KOKXkeKAv+KXkSnilI/wn42fLS3wn42U4pSRKF7il6FeKQ==');
    });
});
