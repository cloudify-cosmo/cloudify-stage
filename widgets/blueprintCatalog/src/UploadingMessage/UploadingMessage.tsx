import { MessageHeader, MessageDescription } from './UploadingMessage.styles';
import Utils from '../utils';

const { LoadingOverlay } = Stage.Basic;
const t = Utils.getWidgetTranslation('uploadingMessage');

interface UploadingMessageProps {
    blueprintName: string;
}

const UploadingMessage = ({ blueprintName }: UploadingMessageProps) => {
    return (
        <LoadingOverlay
            message={
                (
                    <>
                        <MessageHeader>
                            {t('uploading', {
                                blueprintName
                            })}
                        </MessageHeader>
                        <MessageDescription>{t('redirection')}</MessageDescription>
                    </>
                ) as any
            }
        />
    );
};

export default UploadingMessage;
