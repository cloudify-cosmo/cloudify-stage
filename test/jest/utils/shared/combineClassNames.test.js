import combineClassNames from 'utils/shared/combineClassNames';

describe('(Utils) combineClassNames', () => {
    const cases = [
        {
            description: 'a single string',
            classNames: ['a'],
            expectedResult: 'a'
        },
        {
            description: 'multiple strings',
            classNames: ['a', 'b', 'c'],
            expectedResult: 'a b c'
        },
        {
            description: 'multiple strings with falsy values',
            classNames: ['a', false, 'b', 0, '', 'c'],
            expectedResult: 'a b c'
        },
        {
            description: 'all falsy values',
            classNames: [false, 0, ''],
            expectedResult: ''
        }
    ];

    cases.forEach(c => {
        it(`should work for ${c.description}`, () => {
            const result = combineClassNames(c.classNames);
            expect(result).toEqual(c.expectedResult);
        });
    });
});
