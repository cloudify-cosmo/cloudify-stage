import { isEqual } from 'lodash';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { translateWidget } from '../widget.utils';
import { tableRefreshEvent } from '../TokensTable.consts';
import { RequestStatus } from '../types';
import CreatedToken from './CreatedToken';
import type { ReceivedToken, TokensPostRequestBody } from './CreateTokenModal.types';

const { useInput, useErrors } = Stage.Hooks;
const { composeT } = Stage.Utils;
const { Modal, Icon, CancelButton, ApproveButton, DateInput, Input, Form, LoadingOverlay, Message } = Stage.Basic;

const translate = composeT(translateWidget, 'createModal');
const expirationDateFormat = 'YYYY-MM-DD HH:mm';

function formatRequestExpirationDate(expirationDate: string) {
    return moment.utc(moment(expirationDate)).format(expirationDateFormat);
}

function getTokensPostRequestBody(description: string, expirationDate: string): TokensPostRequestBody {
    const body: TokensPostRequestBody = {};
    if (description) body.description = description;
    if (expirationDate) body.expiration_date = formatRequestExpirationDate(expirationDate);
    return body;
}

interface CreateTokenModalProps {
    onClose: () => void;
    toolbox: Stage.Types.Toolbox;
}

const CreateTokenModal = ({ onClose, toolbox }: CreateTokenModalProps) => {
    const { setErrors, getContextError, clearErrors } = useErrors();
    const [description, setDescription] = useInput('');
    const [expirationDate, setExpirationDate] = useInput('');
    const [submittingStatus, setSubmittingStatus] = useState<RequestStatus>(RequestStatus.INITIAL);
    const [receivedToken, setReceivedToken] = useState<ReceivedToken>();
    const showCreateForm = submittingStatus !== RequestStatus.SUBMITTED;
    const manager = toolbox.getManager();

    const handleSubmit = () => {
        clearErrors();

        if (expirationDate) {
            const expirationDateMoment = moment(expirationDate);
            const expirationDateHasInvalidFormat =
                !expirationDateMoment.isValid() ||
                !isEqual(expirationDateMoment.format(expirationDateFormat), expirationDate);
            const expirationDateInPast = expirationDateMoment.isBefore(moment());

            if (expirationDateHasInvalidFormat) {
                setErrors({ expirationDate: translate('errors.expirationDateInvalidFormat') });
                return;
            }

            if (expirationDateInPast) {
                setErrors({ expirationDate: translate('errors.expirationDateInPast') });
                return;
            }
        }

        setSubmittingStatus(RequestStatus.SUBMITTING);
        manager
            .doPost('/tokens', {
                body: getTokensPostRequestBody(description, expirationDate)
            })
            .then((token: ReceivedToken) => {
                toolbox.getEventBus().trigger(tableRefreshEvent);
                flushSync(() => {
                    setSubmittingStatus(RequestStatus.SUBMITTED);
                    setReceivedToken(token);
                });
            })
            .catch(() => {
                setSubmittingStatus(RequestStatus.ERROR);
            });
    };

    return (
        <Modal open onClose={onClose}>
            <Modal.Header>
                <Icon name="add" />
                {translate('header')}
            </Modal.Header>
            <Modal.Content>
                {submittingStatus === RequestStatus.ERROR && (
                    <Message error content={translate('errors.createError')} />
                )}
                {showCreateForm ? (
                    <Form>
                        <Form.Field label={translate('inputs.description')}>
                            <Input value={description} onChange={setDescription} name="description" />
                        </Form.Field>

                        <Form.Field
                            label={translate('inputs.expirationDate')}
                            error={getContextError('expirationDate')}
                        >
                            <DateInput
                                name="expirationDate"
                                value={expirationDate}
                                defaultValue=""
                                minDate={moment()}
                                onChange={setExpirationDate}
                            />
                        </Form.Field>
                    </Form>
                ) : (
                    <CreatedToken token={receivedToken!} />
                )}
                {submittingStatus === RequestStatus.SUBMITTING && <LoadingOverlay />}
            </Modal.Content>
            <Modal.Actions>
                {showCreateForm ? (
                    <>
                        <CancelButton content={translate('buttons.cancel')} onClick={onClose} />
                        <ApproveButton content={translate('buttons.create')} icon="plus" onClick={handleSubmit} />
                    </>
                ) : (
                    <CancelButton content={translate('buttons.close')} onClick={onClose} />
                )}
            </Modal.Actions>
        </Modal>
    );
};

export default CreateTokenModal;
