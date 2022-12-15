import type { FunctionComponent } from 'react';
import React, { useEffect } from 'react';
import { Button, Dropdown, Input } from '../../../../../components/basic';
import { useBoolean, useInput } from '../../../../../utils/hooks';
import { tModal } from './common';

interface SaveButtonProps {
    saveDisabled: boolean;
    onSave: () => void;
    onSaveAsCancel: () => void;
    onSaveAsSubmit: (newFilterId: string) => Promise<void>;
}

const SaveButton: FunctionComponent<SaveButtonProps> = ({ saveDisabled, onSave, onSaveAsCancel, onSaveAsSubmit }) => {
    const [saveAsModeActive, activateSaveAsMode, deactivateSaveAsMode] = useBoolean();
    const [filterId, setFilterId, clearFilterId] = useInput('');

    useEffect(clearFilterId, [saveAsModeActive]);

    function handleSaveAsCancel() {
        deactivateSaveAsMode();
        onSaveAsCancel();
    }

    function handleSaveAsSubmit() {
        onSaveAsSubmit(filterId).then(deactivateSaveAsMode);
    }

    return saveAsModeActive ? (
        <div style={{ float: 'left' }}>
            <Input
                placeholder={tModal('filterIdPlaceholder')}
                style={{ marginRight: '0.25em' }}
                value={filterId}
                onChange={setFilterId}
            />
            <Button icon="cancel" onClick={handleSaveAsCancel} title={tModal('cancel')} />
            <Button content={tModal('saveNew')} onClick={handleSaveAsSubmit} />
        </div>
    ) : (
        <Button.Group style={{ float: 'left', position: 'relative' }}>
            <Button content={tModal('save')} disabled={saveDisabled} onClick={onSave} />
            <Dropdown
                className="button icon"
                options={[{ text: tModal('saveAs'), onClick: activateSaveAsMode, key: '' }]}
                trigger={<></>}
                style={{ position: 'unset' }}
            />
        </Button.Group>
    );
};

export default SaveButton;
