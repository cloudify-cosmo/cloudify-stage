import React from 'react';
import type { FormInputProps } from 'semantic-ui-react';
import InputMaskIcon from './InputMaskIcon';
import { Form } from '../../../components/basic';
import { useToggle } from '../../../utils/hooks';

type SinglelineInputProps = Partial<
    Pick<
        FormInputProps,
        'onChange' | 'name' | 'value' | 'fluid' | 'style' | 'maxLength' | 'disabled' | 'placeholder' | 'width'
    >
>;

const SinglelineInput = ({
    name,
    value,
    onChange,
    disabled,
    fluid,
    style,
    maxLength,
    placeholder,
    width
}: SinglelineInputProps) => {
    const [isInputMasked, toggleInputMask] = useToggle(true);

    return (
        <Form.Input
            type={isInputMasked ? 'password' : 'text'}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            fluid={fluid}
            style={style}
            maxLength={maxLength}
            icon={<InputMaskIcon isInputMasked={isInputMasked} onClick={toggleInputMask} />}
            placeholder={placeholder}
            width={width}
        />
    );
};

export default SinglelineInput;
