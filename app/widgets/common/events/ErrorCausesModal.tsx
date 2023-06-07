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
import type { FullEventData } from './types';

export interface ErrorCausesModalProps {
    event: Pick<FullEventData, 'message' | 'error_causes'>;
    onClose: () => void;
}

const translate = StageUtils.getT('widgets.events.detailsModal');

const ErrorCausesModal: FunctionComponent<ErrorCausesModalProps> = ({ event, onClose }) => {
    const numberOfErrorCauses = _.size(event.error_causes);

    return (
        <Modal open onClose={onClose}>
            <Modal.Header>{translate('header')}</Modal.Header>
            <Modal.Content scrolling>
                {event.message && (
                    <Segment basic>
                        <Header size="medium">{translate('message')}</Header>
                        <Divider />
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{Json.stringify(event.message, true)}</pre>
                        <CopyToClipboardButton
                            content={translate('copyMessage')}
                            text={event.message}
                            className="rightFloated"
                        />
                    </Segment>
                )}
                {_.map(event.error_causes, ({ message, traceback, type }, index) => (
                    <Segment key={`errorCause_${index}`} basic>
                        <Header size="medium">
                            {translate(numberOfErrorCauses > 1 ? 'errorCause' : 'singleErrorCause', {
                                causeNo: index + 1
                            })}
                        </Header>
                        <Divider />
                        <Header size="small">{translate('type')}</Header>
                        <Message info>{type}</Message>
                        <Header size="small">{translate('message')}</Header>
                        <Message error>{message}</Message>
                        {traceback && (
                            <>
                                <Header size="small">{translate('traceback')}</Header>
                                <pre style={{ whiteSpace: 'pre-wrap' }}>{traceback}</pre>
                            </>
                        )}
                    </Segment>
                ))}
            </Modal.Content>
            <Modal.Actions>
                {!!numberOfErrorCauses && (
                    <CopyToClipboardButton
                        content={translate('copyCauses')}
                        text={Json.stringify(event.error_causes, true)}
                    />
                )}
                <CancelButton
                    onClick={e => {
                        e.stopPropagation();
                        onClose();
                    }}
                    content={translate('close')}
                />
            </Modal.Actions>
        </Modal>
    );
};

export default ErrorCausesModal;
