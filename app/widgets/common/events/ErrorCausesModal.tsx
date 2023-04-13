import React from 'react';
import type { FunctionComponent } from 'react';
import {
    CancelButton,
    CopyToClipboardButton,
    Divider,
    Header,
    Message,
    Modal,
    Segment
} from '../../../components/basic';
import Json from '../../../utils/shared/JsonUtils';
import StageUtils from '../../../utils/stageUtils';
import type { Event } from './types';

export interface ErrorCausesModalProps {
    event: Pick<Event, 'message' | 'error_causes'>;
    onClose: () => void;
}

const t = StageUtils.getT('widgets.events.detailsModal');

const ErrorCausesModal: FunctionComponent<ErrorCausesModalProps> = ({ event, onClose }) => {
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

export default ErrorCausesModal;
