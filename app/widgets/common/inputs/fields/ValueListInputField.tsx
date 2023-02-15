import React, { useEffect, useState } from 'react';
import { isPlainObject, noop } from 'lodash';
import type { DropdownItemProps } from 'semantic-ui-react';
import type { Manager } from 'cloudify-ui-components/toolbox';
import i18n from 'i18next';
import { PositionedRevertToDefaultIcon } from './RevertToDefaultIcon';
import type { ErrorAwareInputFieldProps, RevertableInputFieldProps } from './types';
import SecretActions from '../../secrets/SecretActions';

type ValueListInputFieldProps = ErrorAwareInputFieldProps &
    RevertableInputFieldProps & {
        // eslint-disable-next-line camelcase
        validValues: any[] | { get_secret: string };
        multiple: boolean;
        manager: Manager;
    };

const isStringifiedNumber = (value: unknown): boolean => {
    return typeof value === 'string' && !Number.isNaN(+value);
};

const parseOptionValue = (value: any) => {
    return isStringifiedNumber(value) ? `"${value}"` : value;
};

function getOptionsFromSecret(secretValue: string, schema: Record<string, any>) {
    if (schema) {
        const parsedValue = JSON.parse(secretValue);
        if (Array.isArray(parsedValue)) {
            return parsedValue;
        }
        if (isPlainObject(parsedValue)) {
            return Object.keys(parsedValue);
        }
        return [parsedValue];
    }
    return [secretValue];
}

export default function ValueListInputField(props: ValueListInputFieldProps) {
    const { Form } = Stage.Basic;
    const { name, manager, value, onChange, error, validValues, multiple = false, defaultValue } = props;

    const [options, setOptions] = useState<DropdownItemProps[]>();

    function initOptions(values: any[]) {
        setOptions(
            values.map(validValue => {
                const parsedOptionValue = parseOptionValue(validValue);

                return {
                    name: validValue,
                    text: validValue,
                    value: parsedOptionValue
                };
            })
        );
    }

    useEffect(() => {
        if ('get_secret' in validValues) {
            new SecretActions(manager)
                .doGet(validValues.get_secret)
                .then(({ value: secretValue, schema }) => initOptions(getOptionsFromSecret(secretValue, schema)))
                .catch(noop);
        } else {
            initOptions(validValues);
        }
    }, [validValues]);

    return (
        <>
            <Form.Dropdown
                name={name}
                value={value}
                fluid
                selection
                search
                error={error}
                options={options}
                onChange={onChange}
                multiple={multiple}
                defaultValue={defaultValue}
                noResultsMessage={i18n.t('widgets.common.inputs.types.valid_values.noValues')}
            />
            <PositionedRevertToDefaultIcon {...props} right={30} />
        </>
    );
}
