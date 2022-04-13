import { InputProps } from 'semantic-ui-react';
import { DynamicDropdownProps } from '../../components/DynamicDropdown';
import { OnChange } from '../types';

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

export type DynamicDropdownInputFieldProps = ErrorAwareInputFieldProps &
    Pick<DynamicDropdownProps, 'toolbox' | 'constraints'>;
