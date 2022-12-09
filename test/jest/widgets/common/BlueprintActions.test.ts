// @ts-nocheck File not migrated fully to TS
import BlueprintActions, {
    CompletedBlueprintStates,
    InProgressBlueprintStates
} from 'widgets/common/blueprints/BlueprintActions';
import PollHelper from 'widgets/common/utils/PollHelper';

jest.mock('widgets/common/utils/PollHelper');

const wait = jest.fn(() => Promise.resolve());
const resetAttempts = jest.fn();

(<jest.Mock>PollHelper).mockImplementation(() => ({ wait, resetAttempts }));

describe('(Widgets common) BlueprintActions', () => {
    beforeEach(() => {
        Stage.Common = {
            Consts: {}
        };
    });

    it('uploads a blueprint successfully', () => {
        const getBlueprintData = jest.fn();
        getBlueprintData.mockResolvedValueOnce({ state: InProgressBlueprintStates.Pending });
        getBlueprintData.mockResolvedValueOnce({ state: InProgressBlueprintStates.Uploading });
        getBlueprintData.mockResolvedValueOnce({ state: InProgressBlueprintStates.Extracting });
        getBlueprintData.mockResolvedValueOnce({ state: InProgressBlueprintStates.Parsing });
        getBlueprintData.mockResolvedValueOnce({ state: CompletedBlueprintStates.Uploaded });

        const onStateChanged = jest.fn();

        return new BlueprintActions({
            getManager: _.constant({ doPut: _.constant(Promise.resolve()), doGet: getBlueprintData })
        })
            .doUpload('', { onStateChanged })
            .then(() => {
                expect(onStateChanged).toHaveBeenCalledTimes(4);
                expect(onStateChanged).toHaveBeenNthCalledWith(1, InProgressBlueprintStates.Uploading);
                expect(onStateChanged).toHaveBeenNthCalledWith(2, InProgressBlueprintStates.Extracting);
                expect(onStateChanged).toHaveBeenNthCalledWith(3, InProgressBlueprintStates.Parsing);
                expect(onStateChanged).toHaveBeenNthCalledWith(4, InProgressBlueprintStates.UploadingImage);
                expect(wait).toHaveBeenCalledTimes(5);
                expect(resetAttempts).toHaveBeenCalledTimes(3);
            });
    });

    it('handles blueprint upload failure', () => {
        const getBlueprintData = jest.fn();
        const error = 'error message';
        getBlueprintData.mockResolvedValueOnce({
            state: CompletedBlueprintStates.FailedUploading,
            error
        });

        const onStateChanged = jest.fn();

        expect.assertions(3);

        return new BlueprintActions({
            getManager: _.constant({ doPut: _.constant(Promise.resolve()), doGet: getBlueprintData })
        })
            .doUpload('', { onStateChanged })
            .catch(e => {
                expect(e.message).toBe(error);
                expect(e.state).toBe(CompletedBlueprintStates.FailedUploading);
                expect(onStateChanged).not.toHaveBeenCalled();
            });
    });
});
