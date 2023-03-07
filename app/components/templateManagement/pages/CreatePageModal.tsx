import type { CallHistoryMethodAction } from 'connected-react-router';
import _ from 'lodash';
import React from 'react';
import i18n from 'i18next';
import type { StrictInputProps } from 'semantic-ui-react';
import { useBoolean, useErrors, useResettableState } from '../../../utils/hooks';
import { ApproveButton, Button, CancelButton, Form, Icon, Modal } from '../../basic';

export interface CreatePageModalProps {
    onCreatePage: (pageName: string) => Promise<void | CallHistoryMethodAction>;
}

export default function CreatePageModal({ onCreatePage }: CreatePageModalProps) {
    const [pageName, setPageName, resetPageName] = useResettableState('');
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [loading, setLoading, unsetLoading] = useBoolean();
    const [open, setOpen, unsetOpen] = useBoolean();

    function openModal() {
        setOpen();
        unsetLoading();
        resetPageName();
        clearErrors();
    }

    function submitCreate() {
        const errorsObject: { pageName?: string } = {};

        if (_.isEmpty(_.trim(pageName))) {
            errorsObject.pageName = i18n.t(
                'templates.createPageModal.pageNameError',
                'Please provide correct page name'
            );
        }

        if (!_.isEmpty(errorsObject)) {
            setErrors(errorsObject);
            return;
        }

        // Disable the form
        setLoading();

        onCreatePage(_.trim(pageName)).catch(err => {
            setMessageAsError(err);
            unsetLoading();
        });
    }

    const handleInputChange: StrictInputProps['onChange'] = (_event, field) => {
        setPageName(field.value);
    };

    const trigger = (
        <Button content="Create page" icon="file outline" labelPosition="left" className="createPageButton" />
    );

    return (
        <Modal trigger={trigger} open={open} onOpen={openModal} onClose={unsetOpen} className="createPageModal">
            <Modal.Header>
                <Icon name="file outline" />
                {i18n.t('templates.createPageModal.header')}
            </Modal.Header>

            <Modal.Content>
                <Form loading={loading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field error={errors.pageName} label={i18n.t('templates.createPageModal.pageName')}>
                        <Form.Input name="pageName" value={pageName} onChange={handleInputChange} />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={unsetOpen} disabled={loading} />
                <ApproveButton
                    onClick={submitCreate}
                    disabled={loading}
                    content={i18n.t('templates.createPageModal.create')}
                    icon="checkmark"
                />
            </Modal.Actions>
        </Modal>
    );
}
