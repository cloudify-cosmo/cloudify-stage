import { MessageHeader, MessageDescription } from './UploadingMessage.styles';
import Utils from '../utils';

const { LoadingOverlay } = Stage.Basic;
const translate = Utils.getWidgetTranslation('uploadingMessage');

interface UploadingMessageProps {
    blueprintName: string;
}

const UploadingMessage = ({ blueprintName }: UploadingMessageProps) => {
    return (
        <LoadingOverlay
            message={
                <>
                    <MessageHeader>
                        {translate('uploading', {
                            blueprintName
                        })}
                    </MessageHeader>
                    <MessageDescription>{translate('redirection')}</MessageDescription>
                </>
            }
        />
    );
};

export default UploadingMessage;
