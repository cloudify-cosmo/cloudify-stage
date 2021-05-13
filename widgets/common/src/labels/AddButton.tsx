import type { ComponentProps, FunctionComponent } from 'react';

const { Button } = Stage.Basic;

interface LabelAddButtonProps {
    disabled: ComponentProps<typeof Button>['disabled'];
    onClick: ComponentProps<typeof Button>['onClick'];
    onEnterPress: () => void;
}

const LabelAddButton: FunctionComponent<LabelAddButtonProps> = ({ disabled, onClick, onEnterPress }) => {
    const { i18n } = Stage;

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
