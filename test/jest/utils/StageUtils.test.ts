import StageUtils from 'utils/stageUtils';

describe('(Utils) StageUtils', () => {
    describe('formatDisplayName', () => {
        interface Scenario {
            description: string;
            data: Partial<{ id: string; displayName: string }>;
            expectedResult: string;
        }

        const scenarios: Scenario[] = [
            {
                description: 'empty object',
                data: {},
                expectedResult: ''
            },
            {
                description: 'only id',
                data: {
                    id: 'dc1c04a3-1e7f-49a9-82fd-64f388197594'
                },
                expectedResult: 'dc1c04a3-1e7f-49a9-82fd-64f388197594'
            },
            {
                description: 'equal id and display name',
                data: {
                    id: '04f049cb-7874-4903-883a-7631c63be0d5',
                    displayName: '04f049cb-7874-4903-883a-7631c63be0d5'
                },
                expectedResult: '04f049cb-7874-4903-883a-7631c63be0d5'
            },
            {
                description: 'different id and display name',
                data: {
                    id: 'ff9828e9-13d2-4b06-9f6f-8f4ed35c9d26',
                    displayName: 'Tatooine'
                },
                expectedResult: 'Tatooine (ff9828e9-13d2-4b06-9f6f-8f4ed35c9d26)'
            }
        ];

        scenarios.forEach(({ data, description, expectedResult }) => {
            it(`should return ${expectedResult} for ${description}`, () => {
                expect(StageUtils.formatDisplayName(data)).toBe(expectedResult);
            });
        });
    });
});
