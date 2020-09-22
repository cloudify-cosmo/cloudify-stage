function useInputs(initialValues) {
    const { useState } = React;

    const [inputs, setInputs] = useState(initialValues);

    return [
        inputs,
        (values, field) => setInputs({ ...inputs, ...(field ? Stage.Basic.Form.fieldNameValue(field) : values) }),
        () => setInputs(initialValues)
    ];
}

Stage.defineHook({ useInputs });
