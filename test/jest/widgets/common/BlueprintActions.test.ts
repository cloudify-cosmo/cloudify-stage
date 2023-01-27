import { constant } from 'lodash';
import type { WidgetlessToolbox } from 'utils/StageAPI';
import BlueprintActions, {
    CompletedBlueprintStates,
    InProgressBlueprintStates
} from 'widgets/common/blueprints/BlueprintActions';
import PollHelper from 'widgets/common/utils/PollHelper';

jest.mock('widgets/common/utils/PollHelper');

const wait = jest.fn(() => Promise.resolve());
const resetAttempts = jest.fn();

const getRequiredBlueprintActionToolboxPart = (doGet: () => void) => {
    return {
        getManager: constant({ doPut: constant(Promise.resolve()), doGet })
    };
};

(<jest.Mock>PollHelper).mockImplementation(() => ({ wait, resetAttempts }));

describe('(Widgets common) BlueprintActions', () => {
    beforeEach(() => {
        // NOTE: Necessary global API - `any` assertion has been made, as Stage properties are readonly
        (Stage as any).Common = {
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

        const requiredToolboxPart = getRequiredBlueprintActionToolboxPart(getBlueprintData);

        return new BlueprintActions(requiredToolboxPart as unknown as WidgetlessToolbox)
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

        const requiredToolboxPart = getRequiredBlueprintActionToolboxPart(getBlueprintData);

        return new BlueprintActions(requiredToolboxPart as unknown as WidgetlessToolbox)
            .doUpload('', { onStateChanged })
            .catch(e => {
                expect(e.message).toBe(error);
                expect(e.state).toBe(CompletedBlueprintStates.FailedUploading);
                expect(onStateChanged).not.toHaveBeenCalled();
            });
    });
});
