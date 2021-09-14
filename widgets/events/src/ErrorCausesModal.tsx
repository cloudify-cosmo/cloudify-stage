import { FunctionComponent } from 'react';

interface DetailsModalProps {
    // eslint-disable-next-line camelcase
    event: { error_causes: { message: string; traceback: string; type: string }[]; message: any };
    onClose: () => void;
}

const t = Stage.Utils.getT('widgets.events.detailsModal');

const DetailsModal: FunctionComponent<DetailsModalProps> = ({ event, onClose }) => {
    const { Json } = Stage.Utils;
    const {
        CancelButton,
        CopyToClipboardButton,
        Divider,
        Header,
        HighlightText,
        Message,
        Modal,
        Segment
    } = Stage.Basic;
    const numberOfErrorCauses = _.size(event.error_causes);

    return (
        <Modal open onClose={onClose}>
            <Modal.Header>{t('header')}</Modal.Header>
            <Modal.Content scrolling>
                {event.message && (
                    <Segment basic>
                        <Header size="medium">{t('message')}</Header>
                        <Divider />
                        <HighlightText wrapLongLines customStyle={{ overflowX: 'hidden' }} language="json">
                            {Json.stringify(event.message, true)}
                        </HighlightText>
                        <CopyToClipboardButton
                            content={t('copyMessage')}
                            text={event.message}
                            className="rightFloated"
                        />
                    </Segment>
                )}
                {_.map(event.error_causes, ({ message, traceback, type }, index) => (
                    <Segment key={`errorCause_${index}`} basic>
                        <Header size="medium">
                            {t(numberOfErrorCauses > 1 ? 'errorCause' : 'singleErrorCause', { causeNo: index + 1 })}
                        </Header>
                        <Divider />
                        <Header size="small">{t('type')}</Header>
                        <Message info>{type}</Message>
                        <Header size="small">{t('message')}</Header>
                        <Message error>{message}</Message>
                        {traceback && (
                            <>
                                <Header size="small">{t('traceback')}</Header>
                                <HighlightText wrapLongLines customStyle={{ overflowX: 'hidden' }} language="python">
                                    {traceback}
                                </HighlightText>
                            </>
                        )}
                    </Segment>
                ))}
            </Modal.Content>
            <Modal.Actions>
                {!!numberOfErrorCauses && (
                    <CopyToClipboardButton content={t('copyCauses')} text={Json.stringify(event.error_causes, true)} />
                )}
                <CancelButton
                    onClick={e => {
                        e.stopPropagation();
                        onClose();
                    }}
                    content={t('close')}
                />
            </Modal.Actions>
        </Modal>
    );
};

export default DetailsModal;
