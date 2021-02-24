export default function LabelValueInput({ initialValue, onCancel, onSubmit }) {
    const { Form } = Stage.Basic;
    const { RevertToDefaultIcon } = Stage.Common;
    const { useInput } = Stage.Hooks;

    const [currentLabelValue, setCurrentLabelValue] = useInput(initialValue);

    return (
        <Form.Input
            className="labelValueEditInput"
            autoFocus
            fluid
            style={{ padding: 0 }}
            value={currentLabelValue}
            onBlur={() => onSubmit(currentLabelValue)}
            onKeyDown={e => {
                if (e.key === 'Escape') onCancel();
                else if (e.key === 'Enter') onSubmit(currentLabelValue);
            }}
            onChange={setCurrentLabelValue}
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
    onSubmit: PropTypes.func.isRequired
};
