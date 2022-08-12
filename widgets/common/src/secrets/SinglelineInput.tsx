import type { FormInputProps } from 'semantic-ui-react';
import InputMaskIcon from './InputMaskIcon';

type SinglelineInputProps = Partial<
    Pick<FormInputProps, 'onChange' | 'name' | 'value' | 'fluid' | 'style' | 'maxLength' | 'disabled' | 'width'>
>;

const { Form } = Stage.Basic;
const { useToggle } = Stage.Hooks;

const SinglelineInput = ({ name, value, onChange, disabled, fluid, style, maxLength, width }: SinglelineInputProps) => {
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
            width={width}
        />
    );
};

export default SinglelineInput;
