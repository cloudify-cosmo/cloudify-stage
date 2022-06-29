import { inputMaxLength } from '../TerraformModal';

const { Form } = Stage.Basic;
const { useFormErrors } = Stage.Hooks;

const t = Stage.Utils.getT('widgets.blueprints.terraformModal');

interface BlueprintNameFieldProps {
    setName: (value: any, field: any) => void;
    name: string;
}

export default function BlueprintNameField({ setName, name }: BlueprintNameFieldProps) {
    const { getFieldError } = useFormErrors('terraformModal');

    return (
        <Form.Input
            label={t(`blueprintName`)}
            required
            value={name}
            onChange={setName}
            error={getFieldError('blueprintName')}
        >
            <input maxLength={inputMaxLength} />
        </Form.Input>
    );
}
