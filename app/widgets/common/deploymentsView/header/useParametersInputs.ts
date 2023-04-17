import { useState } from 'react';
import { Form } from '../../../../components/basic';
import type { ParameterInputs } from './RunWorkflowModal.types';

const initialValues = {};

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
