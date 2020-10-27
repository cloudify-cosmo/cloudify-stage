import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useBoolean } from '../utils/hooks';
import { ApproveButton, CancelButton, Form, Modal } from './basic';

export default function EditTabModal({ tab, trigger, onTabUpdate }) {
    const [open, setOpen, unsetOpen] = useBoolean();
    const [name, setName] = useState();
    const [isDefault, setDefault] = useState();

    useEffect(() => {
        setName(tab.name);
        setDefault(tab.isDefault);
    }, [tab]);

    return (
        <Modal trigger={trigger} open={open} onOpen={setOpen} onClose={unsetOpen}>
            <Modal.Header>Edit Tab</Modal.Header>

            <Modal.Content>
                <Form>
                    <Form.Field label="Tab name">
                        <Form.Input value={name} onChange={(e, { value }) => setName(value)} />
                    </Form.Field>
                    <Form.Field label="Default tab">
                        <Form.Checkbox
                            label=" "
                            toggle
                            checked={isDefault}
                            onChange={(e, { checked }) => setDefault(checked)}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <ApproveButton
                    onClick={() => {
                        onTabUpdate(name, isDefault);
                        unsetOpen();
                    }}
                />
                <CancelButton onClick={unsetOpen} />
            </Modal.Actions>
        </Modal>
    );
}

EditTabModal.propTypes = {
    tab: PropTypes.shape({ name: PropTypes.string, isDefault: PropTypes.bool }).isRequired,
    trigger: PropTypes.element.isRequired,
    onTabUpdate: PropTypes.func.isRequired
};
