const { LoadingOverlay } = Stage.Basic;

interface UploadingMessageProps {
    blueprintName: string;
}

const UploadingMessage = ({ blueprintName }: UploadingMessageProps) => {
    return (
        <LoadingOverlay
            message={
                (
                    <>
                        Uploading {blueprintName} blueprint <br />
                        After completing the upload, you'll be redirected to the blueprint page
                    </>
                ) as any
            }
        />
    );
};

export default UploadingMessage;
