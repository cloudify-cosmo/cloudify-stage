export default function LabelValueInput({ initialValue, onCancel, onChange, onSubmit }) {
    const { Form } = Stage.Basic;
    const { RevertToDefaultIcon } = Stage.Common;
    const { useInput } = Stage.Hooks;

    const [currentLabelValue, setCurrentLabelValue] = useInput(initialValue);

    return (
        <Form.Input
            className="labelValueEditInput"
            autoFocus
            focus
            fluid
            style={{ padding: 0, marginLeft: -5, marginRight: -5 }}
            value={currentLabelValue}
            onKeyDown={e => {
                if (e.key === 'Escape') onCancel();
                else if (e.key === 'Enter') onSubmit(currentLabelValue);
            }}
            onChange={(e, { value }) => {
                setCurrentLabelValue(value);
                onChange(value);
            }}
            icon={
                <RevertToDefaultIcon
                    value={currentLabelValue}
                    defaultValue={initialValue}
                    popupContent="Revert to initial value"
                    onMouseDown={e => {
                        e.preventDefault();
                        setCurrentLabelValue(initialValue);
                    }}
                />
            }
        />
    );
}

LabelValueInput.propTypes = {
    initialValue: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};
