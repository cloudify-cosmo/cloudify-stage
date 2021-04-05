export default function LabelAddButton({ disabled, onClick, onEnterPress }) {
    const {
        Basic: { Button },
        i18n
    } = Stage;

    function handleKeyDown({ key }) {
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
}

LabelAddButton.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onEnterPress: PropTypes.func.isRequired
};
