import StageUtils from 'utils/stageUtils';

// NOTE: Necessary global API - `any` assertion has been made, as Stage properties are readonly
(Stage as any).Utils = StageUtils;

// NOTE: use `require` to lazily load the module after `Stage.Utils` is set
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { isSiteWithPosition } = require('widgets/common/map/site');

describe('(Widgets common) isSiteWithPosition', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const declareValidityCheck = (expectedResult: boolean, position: [any, any]) => {
        it(`should return ${expectedResult} for ${position}`, () => {
            expect(
                isSiteWithPosition({
                    name: 'abc',
                    latitude: position[0],
                    longitude: position[1]
                })
            ).toBe(expectedResult);
        });
    };

    const validPositions: [number, number][] = [
        [1, 2],
        [1.543241, -12.123123],
        [51.5224160825326, -0.1318359375],
        [42.322001080603, -71.12548828125],
        [32.7734193549752, -117.04833984375]
    ];
    validPositions.forEach(position => declareValidityCheck(true, position));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invalidPositions: [any, any][] = [
        [null, null],
        [NaN, NaN],
        [Infinity, Infinity],
        [-Infinity, -Infinity],
        ['12.33', '1.8'],
        [true, false]
    ];
    invalidPositions.forEach(position => declareValidityCheck(false, position));
});
