import React, { useEffect, useState } from 'react';
import type { TabContent } from 'app/actions/page';
import StageUtils from '../../../utils/stageUtils';
import { useBoolean } from '../../../utils/hooks';
import { ApproveButton, CancelButton, Form, Modal } from '../../basic';

const translate = StageUtils.getT('editMode.tabs');

interface EditTabModalProps {
    tab: TabContent;
    trigger: JSX.Element;
    onTabUpdate: (name: string, isDefault: boolean) => void;
}

export default function EditTabModal({ tab, trigger, onTabUpdate }: EditTabModalProps) {
    const [open, setOpen, unsetOpen] = useBoolean();
    const [name, setName] = useState('');
    const [isDefault, setDefault] = useState(false);

    useEffect(() => {
        setName(tab.name);
        setDefault(!!tab.isDefault);
    }, [tab]);

    return (
        <Modal trigger={trigger} open={open} onOpen={setOpen} onClose={unsetOpen}>
            <Modal.Header>Edit Tab</Modal.Header>

            <Modal.Content>
                <Form>
                    <Form.Field label={translate('name')}>
                        <Form.Input value={name} onChange={(_event, { value }) => setName(value)} />
                    </Form.Field>
                    <Form.Field label={translate('default')}>
                        <Form.Checkbox
                            label=" "
                            toggle
                            checked={isDefault}
                            onChange={(_event, { checked }) => setDefault(checked || false)}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={unsetOpen} />
                <ApproveButton
                    onClick={() => {
                        onTabUpdate(name, isDefault);
                        unsetOpen();
                    }}
                />
            </Modal.Actions>
        </Modal>
    );
}
