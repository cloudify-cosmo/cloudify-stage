import type { FunctionComponent, KeyboardEvent, SyntheticEvent } from 'react';

const labelInputType = 'value';

interface LabelValueInputProps {
    initialValue: string;
    onCancel: () => void;
    onChange: (value: string) => void;
    onSubmit: () => void;
    valueAlreadyUsed: boolean;
}

const LabelValueInput: FunctionComponent<LabelValueInputProps> = ({
    initialValue,
    onCancel,
    onChange,
    onSubmit,
    valueAlreadyUsed
}) => {
    const { Form } = Stage.Basic;
    const { RevertToDefaultIcon } = Stage.Common.Components;
    const { DuplicationErrorPopup, ValidationErrorPopup } = Stage.Common.Labels;
    const { useLabelInput } = Stage.Hooks;
    const { i18n } = Stage;

    const { inputValue, invalidCharacterTyped, submitChange, resetInput } = useLabelInput(onChange, labelInputType, {
        initialValue
    });
    const valueIsValid = inputValue && !valueAlreadyUsed;

    return (
        <>
            {invalidCharacterTyped && <ValidationErrorPopup type={labelInputType} />}
            {valueAlreadyUsed && <DuplicationErrorPopup />}
            <Form.Input
                className="labelValueEditInput"
                autoFocus
                focus
                fluid
                style={{ padding: 0, marginLeft: -5, marginRight: -5 }}
                value={inputValue}
                onKeyDown={(event: KeyboardEvent) => {
                    if (event.key === 'Escape') onCancel();
                    else if (event.key === 'Enter' && valueIsValid) onSubmit();
                }}
                onChange={submitChange}
                icon={
                    <RevertToDefaultIcon
                        value={inputValue}
                        defaultValue={initialValue}
                        popupContent={i18n.t('widgets.labels.revert')}
                        onMouseDown={(event: SyntheticEvent) => {
                            event.preventDefault();
                            resetInput();
                        }}
                    />
                }
            />
        </>
    );
};
export default LabelValueInput;
