import installFiles from '../../../handler/widgets/installFiles';

describe('installFiles', () => {
    it('rejects on invalid source path', () => expect(installFiles('', '')).rejects.toBeTruthy());
});
