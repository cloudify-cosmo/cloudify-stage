import External from 'utils/External';

describe('(Utils) External', () => {
    describe('buildActualUrl (protected)', () => {
        const external = new External({});

        it(`should return correct url with params`, () => {
            expect(
                // @ts-ignore testing protected function
                external.buildActualUrl('https://localhost:8081', {
                    foo: 'FOO',
                    bar: 612,
                    baz: [13, 987, 3]
                })
            ).toBe('https://localhost:8081?foo=FOO&bar=612&baz=13&baz=987&baz=3');
            expect(
                // @ts-ignore testing protected function
                external.buildActualUrl('https://localhost:8081?qux=QUX', {
                    foo: 'FOO',
                    bar: 612,
                    baz: [13, 987, 3]
                })
            ).toBe('https://localhost:8081?qux=QUX&foo=FOO&bar=612&baz=13&baz=987&baz=3');
        });
    });
});
