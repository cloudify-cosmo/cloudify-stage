import React, { useEffect, useState } from 'react';
import { isPlainObject, map, noop } from 'lodash';
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

export default function ValueListInputField(props: ValueListInputFieldProps) {
    const { Form } = Stage.Basic;
    const { name, manager, value, onChange, error, validValues, multiple = false, defaultValue } = props;

    const [options, setOptions] = useState<DropdownItemProps[]>();

    function initOptions(values: any[]) {
        setOptions(
            map(values, validValue => {
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
                .then(({ value: secretValue, schema }) => {
                    let optionsToSet;
                    if (schema) {
                        const parsedValue = JSON.parse(secretValue);
                        if (Array.isArray(parsedValue)) {
                            optionsToSet = parsedValue;
                        } else if (isPlainObject(parsedValue)) {
                            optionsToSet = Object.keys(parsedValue);
                        } else {
                            optionsToSet = [parsedValue];
                        }
                    } else {
                        optionsToSet = [secretValue];
                    }
                    initOptions(optionsToSet);
                })
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
                noResultsMessage={i18n.t('input.valid_values.noValues')}
            />
            <PositionedRevertToDefaultIcon {...props} right={30} />
        </>
    );
}
