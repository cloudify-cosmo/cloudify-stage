const { LoadingOverlay } = Stage.Basic;

const t = Stage.Utils.getT('widgets.blueprintCatalog.uploadingMessage');

interface UploadingMessageProps {
    blueprintName: string;
}

const UploadingMessage = ({ blueprintName }: UploadingMessageProps) => {
    return (
        <LoadingOverlay
            message={
                (
                    <>
                        {t('uploading', {
                            blueprintName
                        })}
                        <br />
                        {t('redirection')}
                    </>
                ) as any
            }
        />
    );
};

export default UploadingMessage;
