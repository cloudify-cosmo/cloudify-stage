import type { ComponentProps, FunctionComponent } from 'react';
import React from 'react';

interface LabelAddButtonProps {
    disabled: ComponentProps<typeof Stage.Basic.Button>['disabled'];
    onClick: ComponentProps<typeof Stage.Basic.Button>['onClick'];
    onEnterPress: () => void;
}

const LabelAddButton: FunctionComponent<LabelAddButtonProps> = ({ disabled, onClick, onEnterPress }) => {
    const {
        i18n,
        Basic: { Button }
    } = Stage;

    function handleKeyDown({ key }: { key: string }) {
        if (key === 'Enter') onEnterPress();
    }

    return (
        <Button
            aria-label={i18n.t('widgets.common.labels.addButton')}
            icon="add"
            onClick={onClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            fluid
        />
    );
};
export default LabelAddButton;
