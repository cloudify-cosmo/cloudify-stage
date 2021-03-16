import React, { ChangeEvent, memo } from 'react';
import BooleanFieldHandler from '../../common/UncontrolledForm/BooleanFieldHandler';

type Props = {
    name: string;
    logo: string;
    label: string;
    value?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const TechnologyButton = memo(({ name, logo, label, value, onChange }: Props) => {
    const { Button, Image } = Stage.Basic;
    return (
        <BooleanFieldHandler name={name} value={value} onChange={onChange}>
            {(checked, handleChange) => {
                const handleClick = () => handleChange(!checked);
                return (
                    <Button fluid basic size="huge" active={checked} style={{ height: '70px' }} onClick={handleClick}>
                        <Image src={logo} inline style={{ maxHeight: '100%', cursor: 'pointer' }} />
                        <span style={{ marginLeft: '10px' }}>{label}</span>
                    </Button>
                );
            }}
        </BooleanFieldHandler>
    );
});

export default TechnologyButton;
