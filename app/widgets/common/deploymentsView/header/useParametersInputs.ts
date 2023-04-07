import { useState } from 'react';
import { Form } from 'cloudify-ui-components';

const initialValues = {};
type ParameterInputs = Record<string, unknown>;

function useParametersInputs() {
    const [inputs, setInputs] = useState<ParameterInputs>(initialValues);

    const resetInputs = (parametersInputs: ParameterInputs = initialValues) => {
        setInputs(parametersInputs);
    };

    return [
        inputs,
        (values: any, field?: any) => setInputs({ ...inputs, ...(field ? Form.fieldNameValue(field) : values) }),
        resetInputs
    ] as const;
}

export default useParametersInputs;
