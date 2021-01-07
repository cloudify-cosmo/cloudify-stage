import BlueprintActions from 'common/src/BlueprintActions';

const { InProgressBlueprintStates } = BlueprintActions;

describe('(Widgets common) BlueprintActions', () => {
    it('uploads a blueprint successfully', () => {
        jest.setTimeout(6000);

        const getBlueprintData = jest.fn();
        getBlueprintData.mockResolvedValueOnce({ state: InProgressBlueprintStates.Pending });
        getBlueprintData.mockResolvedValueOnce({ state: InProgressBlueprintStates.Uploading });
        getBlueprintData.mockResolvedValueOnce({ state: InProgressBlueprintStates.Extracting });
        getBlueprintData.mockResolvedValueOnce({ state: InProgressBlueprintStates.Parsing });
        getBlueprintData.mockResolvedValueOnce({ state: BlueprintActions.CompletedBlueprintStates.Uploaded });

        const onStateChanged = jest.fn();

        return new BlueprintActions({
            getManager: _.constant({ doPut: _.constant(Promise.resolve()), doGet: getBlueprintData })
        })
            .doUpload(null, null, null, null, null, null, null, onStateChanged)
            .then(() => {
                expect(onStateChanged).toHaveBeenCalledTimes(4);
                expect(onStateChanged).toHaveBeenNthCalledWith(1, InProgressBlueprintStates.Uploading);
                expect(onStateChanged).toHaveBeenNthCalledWith(2, InProgressBlueprintStates.Extracting);
                expect(onStateChanged).toHaveBeenNthCalledWith(3, InProgressBlueprintStates.Parsing);
                expect(onStateChanged).toHaveBeenNthCalledWith(4, InProgressBlueprintStates.UploadingImage);
            });
    });

    it('handles blueprint upload failure', () => {
        const getBlueprintData = jest.fn();
        const error = 'error message';
        getBlueprintData.mockResolvedValueOnce({
            state: BlueprintActions.CompletedBlueprintStates.FailedUploading,
            error
        });

        const onStateChanged = jest.fn();

        expect.assertions(3);

        return new BlueprintActions({
            getManager: _.constant({ doPut: _.constant(Promise.resolve()), doGet: getBlueprintData })
        })
            .doUpload(null, null, null, null, null, null, null, onStateChanged)
            .catch(e => {
                expect(e.message).toBe(error);
                expect(e.state).toBe(BlueprintActions.CompletedBlueprintStates.FailedUploading);
                expect(onStateChanged).not.toHaveBeenCalled();
            });
    });
});
