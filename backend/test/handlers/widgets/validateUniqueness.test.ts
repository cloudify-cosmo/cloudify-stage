import validateUniqueness from '../../../handler/widgets/validateUniqueness';

describe('validateUniqueness', () => {
    // eslint-disable-next-line jest/expect-expect -- we're returning a promise that if rejected will fail the test
    it('resolves when widget does not exist', () => validateUniqueness('nonExistingWidgetId'));
});
