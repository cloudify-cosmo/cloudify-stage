import validateUniqueness from '../../../handler/widgets/validateUniqueness';

describe('validateUniqueness', () => {
    it('resolves when widget does not exist', () => validateUniqueness('nonExistingWidgetId'));
});
