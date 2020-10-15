/**
 * Created by pposel on 22/08/2017.
 */
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { useBoolean, useErrors, useResettableState } from '../../utils/hooks';
import { ApproveButton, Button, CancelButton, Form, Icon, Modal } from '../basic/index';

export default function CreatePageModal({ onCreatePage, pageName: initialPageName }) {
    const [pageName, setPageName] = useState(initialPageName);
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [loading, setLoading, unsetLoading] = useBoolean();
    const [open, setOpen, unsetOpen] = useResettableState();

    function openModal() {
        setOpen();
        unsetLoading();
        setPageName(initialPageName);
        clearErrors();
    }

    function submitCreate() {
        const errorsObject = {};

        if (_.isEmpty(_.trim(pageName))) {
            errorsObject.pageName = 'Please provide correct page name';
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

    function handleInputChange(proxy, field) {
        setPageName(field.value);
    }

    const trigger = (
        <Button content="Create page" icon="block layout" labelPosition="left" className="createPageButton" />
    );

    return (
        <Modal trigger={trigger} open={open} onOpen={openModal} onClose={unsetOpen} className="createPageModal">
            <Modal.Header>
                <Icon name="block layout" />
                Create page
            </Modal.Header>

            <Modal.Content>
                <Form loading={loading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field error={errors.pageName}>
                        <Form.Input
                            name="pageName"
                            placeholder="Page name"
                            value={pageName}
                            onChange={handleInputChange}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={() => setOpen(false)} disabled={loading} />
                <ApproveButton
                    onClick={submitCreate}
                    disabled={loading}
                    content="Create"
                    icon="checkmark"
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
}

CreatePageModal.propTypes = {
    onCreatePage: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    pageName: PropTypes.string
};

CreatePageModal.defaultProps = {
    pageName: ''
};
