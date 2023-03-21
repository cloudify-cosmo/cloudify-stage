import type { FunctionComponent } from 'react';
import type { Event } from './types';

interface DetailsModalProps {
    event: Event;
    onClose: () => void;
}

const t = Stage.Utils.getT('widgets.events.detailsModal');

const DetailsModal: FunctionComponent<DetailsModalProps> = ({ event, onClose }) => {
    const { Json } = Stage.Utils;
    const { CancelButton, CopyToClipboardButton, Divider, Header, Message, Modal, Segment } = Stage.Basic;
    const numberOfErrorCauses = _.size(event.error_causes);

    return (
        <Modal open onClose={onClose}>
            <Modal.Header>{t('header')}</Modal.Header>
            <Modal.Content scrolling>
                {event.message && (
                    <Segment basic>
                        <Header size="medium">{t('message')}</Header>
                        <Divider />
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{Json.stringify(event.message, true)}</pre>
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
                                <pre style={{ whiteSpace: 'pre-wrap' }}>{traceback}</pre>
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
