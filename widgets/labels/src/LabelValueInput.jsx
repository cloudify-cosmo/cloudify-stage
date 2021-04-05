export default function LabelValueInput({ initialValue, onCancel, onChange, onSubmit, valueAlreadyUsed }) {
    const { Form } = Stage.Basic;
    const { RevertToDefaultIcon } = Stage.Common;
    const { DuplicationErrorPopup, ValidationErrorPopup } = Stage.Common.Labels;
    const { useLabelInput } = Stage.Hooks;
    const { i18n } = Stage;

    const { inputValue, invalidCharacterTyped, submitChange, resetInput } = useLabelInput(onChange, initialValue);
    const valueIsValid = inputValue && !valueAlreadyUsed;

    return (
        <>
            {invalidCharacterTyped && <ValidationErrorPopup />}
            {valueAlreadyUsed && <DuplicationErrorPopup />}
            <Form.Input
                className="labelValueEditInput"
                autoFocus
                focus
                fluid
                style={{ padding: 0, marginLeft: -5, marginRight: -5 }}
                value={inputValue}
                onKeyDown={e => {
                    if (e.key === 'Escape') onCancel();
                    else if (e.key === 'Enter' && valueIsValid) onSubmit(inputValue);
                }}
                onChange={submitChange}
                icon={
                    <RevertToDefaultIcon
                        value={inputValue}
                        defaultValue={initialValue}
                        popupContent={i18n.t('widgets.labels.revert')}
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
    onSubmit: PropTypes.func.isRequired,
    valueAlreadyUsed: PropTypes.bool.isRequired
};
