export default function LabelValueInput({ initialValue, onCancel, onChange, onSubmit }) {
    const { Form } = Stage.Basic;
    const { LabelValidationErrorPopup, RevertToDefaultIcon } = Stage.Common;
    const { useLabelInput } = Stage.Hooks;

    const { inputValue, isInvalidCharacterTyped, submitChange, resetInput } = useLabelInput(onChange, initialValue);

    return (
        <>
            <LabelValidationErrorPopup open={isInvalidCharacterTyped} />
            <Form.Input
                className="labelValueEditInput"
                autoFocus
                focus
                fluid
                style={{ padding: 0, marginLeft: -5, marginRight: -5 }}
                value={inputValue}
                onKeyDown={e => {
                    if (e.key === 'Escape') onCancel();
                    else if (e.key === 'Enter') onSubmit(inputValue);
                }}
                onChange={submitChange}
                icon={
                    <RevertToDefaultIcon
                        value={inputValue}
                        defaultValue={initialValue}
                        popupContent="Revert to initial value"
                        onMouseDown={e => {
                            e.preventDefault();
                            resetInput();
                        }}
                    />
                }
            />
        </>
    );
}

LabelValueInput.propTypes = {
    initialValue: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};
