import styled from 'styled-components';
import Utils from './utils';

const { LoadingOverlay } = Stage.Basic;
const t = Utils.getWidgetTranslation('uploadingMessage');

const MessageLine = styled.span`
    display: block;

    & + & {
        margin-top: 8px;
    }
`;

interface UploadingMessageProps {
    blueprintName: string;
}

const UploadingMessage = ({ blueprintName }: UploadingMessageProps) => {
    return (
        <LoadingOverlay
            message={
                (
                    <>
                        <MessageLine>
                            {t('uploading', {
                                blueprintName
                            })}
                        </MessageLine>
                        <MessageLine>{t('redirection')}</MessageLine>
                    </>
                ) as any
            }
        />
    );
};

export default UploadingMessage;
