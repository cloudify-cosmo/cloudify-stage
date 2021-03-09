export default function LabelValueInput({ initialValue, onCancel, onChange, onSubmit }) {
    const { Form } = Stage.Basic;
    const { RevertToDefaultIcon } = Stage.Common;
    const { ValidationErrorPopup } = Stage.Common.Labels;
    const { useLabelInput } = Stage.Hooks;
    const { i18n } = Stage;

    const { inputValue, invalidCharacterTyped, submitChange, resetInput } = useLabelInput(onChange, initialValue);

    return (
        <>
            <ValidationErrorPopup open={invalidCharacterTyped} />
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
    onSubmit: PropTypes.func.isRequired
};
