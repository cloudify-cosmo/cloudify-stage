import { isEmptyWidgetData } from 'utils/StageAPI';

describe('(Utils) StageAPI', () => {
    describe('isEmptyWidgetData', () => {
        interface Scenario {
            description: string;
            data: unknown;
            expectedResult: boolean;
        }

        const scenarios: Scenario[] = [
            { description: 'an empty object', data: {}, expectedResult: true },
            { description: 'an empty array', data: [], expectedResult: false },
            { description: 'an object with properties', data: { items: [] }, expectedResult: false },
            { description: 'undefined', data: undefined, expectedResult: true },
            { description: 'null', data: null, expectedResult: false },
            { description: 'false', data: false, expectedResult: false },
            { description: 'true', data: true, expectedResult: false },
            { description: '0', data: 0, expectedResult: false },
            { description: 'an empty string', data: '', expectedResult: false }
        ];

        scenarios.forEach(({ data, description, expectedResult }) => {
            it(`should return ${expectedResult} for ${description}`, () => {
                expect(isEmptyWidgetData(data)).toBe(expectedResult);
            });
        });
    });
});
