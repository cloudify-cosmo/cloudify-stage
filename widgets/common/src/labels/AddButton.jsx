export default function LabelAddButton({ disabled, onClick, onEnterPress }) {
    const { Button } = Stage.Basic;

    function handleKeyDown({ key }) {
        if (key === 'Enter') onEnterPress();
    }

    return <Button icon="add" onClick={onClick} onKeyDown={handleKeyDown} disabled={disabled} fluid />;
}

LabelAddButton.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onEnterPress: PropTypes.func.isRequired
};
