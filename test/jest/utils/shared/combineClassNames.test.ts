import combineClassNames from 'utils/shared/combineClassNames';

describe('(Utils) combineClassNames', () => {
    interface TestCase {
        description: string;
        classNames: Parameters<typeof combineClassNames>;
        expectedResult: string;
    }

    const cases: TestCase[] = [
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
        },
        {
            description: 'nested arrays',
            classNames: [['a', 'b'], 'c', ['d'], false && 'e', false],
            expectedResult: 'a b c d'
        }
    ];

    cases.forEach(c => {
        it(`should work for ${c.description}`, () => {
            const result = combineClassNames(...c.classNames);
            expect(result).toEqual(c.expectedResult);
        });
    });
});
