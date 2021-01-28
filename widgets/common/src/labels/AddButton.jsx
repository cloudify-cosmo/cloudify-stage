export default function LabelAddButton({ disabled, onClick }) {
    const { Button } = Stage.Basic;

    return <Button icon="add" onClick={onClick} disabled={disabled} fluid />;
}

LabelAddButton.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};
