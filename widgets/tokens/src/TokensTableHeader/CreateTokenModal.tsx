import { isEqual } from 'lodash';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { translationPath } from '../widget.consts';
import { tableRefreshEvent } from '../TokensTable.consts';
import { RequestStatus } from '../types';
import CreatedToken from './CreatedToken';
import type { ReceivedToken, TokensPostRequestBody } from './CreateTokenModal.types';

const { useInput, useErrors } = Stage.Hooks;
const { getT } = Stage.Utils;
const { Modal, Icon, CancelButton, ApproveButton, DateInput, Input, Form, LoadingOverlay, Message } = Stage.Basic;

const t = getT(`${translationPath}.createModal`);
const expirationDateFormat = 'YYYY-MM-DD HH:mm';

function getTokensPostRequestBody(description: string, expirationDate: string): TokensPostRequestBody {
    const body: TokensPostRequestBody = {};
    if (description) body.description = description;
    if (expirationDate) body.expiration_date = moment.utc(moment(expirationDate)).format(expirationDateFormat);
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

            if (expirationDateHasInvalidFormat) {
                setErrors({ expirationDate: t('errors.expirationDateInvalidFormat') });
                return;
            }

            if (expirationDateMoment.isBefore(moment())) {
                setErrors({ expirationDate: t('errors.expirationDateBeforeCurrentDate') });
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
                {t('header')}
            </Modal.Header>
            <Modal.Content>
                {submittingStatus === RequestStatus.ERROR && <Message error content={t('errors.createError')} />}
                {showCreateForm ? (
                    <Form>
                        <Form.Input label={t('inputs.description')}>
                            <Input value={description} onChange={setDescription} name="description" />
                        </Form.Input>

                        <Form.Field label={t('inputs.expirationDate')} error={getContextError('expirationDate')}>
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
                        <CancelButton content={t('buttons.cancel')} onClick={onClose} />
                        <ApproveButton content={t('buttons.create')} icon="plus" onClick={handleSubmit} />
                    </>
                ) : (
                    <CancelButton content={t('buttons.close')} onClick={onClose} />
                )}
            </Modal.Actions>
        </Modal>
    );
};

export default CreateTokenModal;
