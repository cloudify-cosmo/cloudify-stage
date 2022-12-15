import type { InputProps } from 'semantic-ui-react';
import type { DynamicDropdownProps } from '../../components/DynamicDropdown';
import type { Constraint, OnChange } from '../types';

export interface InputFieldProps {
    name: string;
    value: any;
    onChange: OnChange;
}

export interface RevertableInputFieldProps extends InputFieldProps {
    defaultValue: any;
}

export interface ErrorAwareInputFieldProps extends InputFieldProps {
    error: InputProps['error'];
}

export type DynamicDropdownInputFieldProps = ErrorAwareInputFieldProps & { constraints: Constraint[] } & Pick<
        DynamicDropdownProps,
        'toolbox' | 'multiple'
    >;
