/**
 * Created by pposel on 22/08/2017.
 */
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { ApproveButton, Button, CancelButton, Form, Icon, Modal } from '../basic/index';

export default function CreatePageModal({ onCreatePage, pageName: initialPageName }) {
    const [pageName, setPageName] = useState(initialPageName);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    function openModal() {
        setOpen(true);
        setLoading(false);
        setPageName(initialPageName);
        setErrors({});
    }

    function submitCreate() {
        const errorsObject = {};

        if (_.isEmpty(_.trim(pageName))) {
            errorsObject.pageName = 'Please provide correct page name';
        }

        if (!_.isEmpty(errorsObject)) {
            setErrors(errorsObject);
            return false;
        }

        // Disable the form
        setLoading(true);

        return onCreatePage(_.trim(pageName)).catch(err => {
            setErrors({ error: err.message });
            setLoading(false);
        });
    }

    function handleInputChange(proxy, field) {
        setPageName(field.value);
    }

    const trigger = (
        <Button content="Create page" icon="block layout" labelPosition="left" className="createPageButton" />
    );

    return (
        <Modal
            trigger={trigger}
            open={open}
            onOpen={openModal}
            onClose={() => setOpen(false)}
            className="createPageModal"
        >
            <Modal.Header>
                <Icon name="block layout" />
                Create page
            </Modal.Header>

            <Modal.Content>
                <Form loading={loading} errors={errors} onErrorsDismiss={() => setErrors({})}>
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
