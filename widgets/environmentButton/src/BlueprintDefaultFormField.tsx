import type { ExtraFormFieldProps } from 'app/widgets/common/labels/LabelsInput';
import type { DefaultableLabel } from './widget.types';
import { blueprintDefaultHighlightHTMLColor } from './widget.consts';

const translate = Stage.Utils.getT('widgets.environmentButton.createNewModal.form.labels');

export default function BlueprintDefaultFormField({ label, onChange }: ExtraFormFieldProps<DefaultableLabel>) {
    const { Form } = Stage.Basic;
    return (
        <Form.Field
            width={4}
            style={{
                alignSelf: 'center',
                padding: 3,
                borderRadius: '0.3em',
                backgroundColor: blueprintDefaultHighlightHTMLColor
            }}
        >
            <Form.Checkbox
                label={translate('default')}
                onChange={() => onChange({ ...label, blueprintDefault: !label.blueprintDefault })}
            />
        </Form.Field>
    );
}
