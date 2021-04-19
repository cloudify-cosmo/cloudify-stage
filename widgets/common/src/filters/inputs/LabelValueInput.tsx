import type { FunctionComponent } from 'react';
import { useRef } from 'react';

import LabelKeyDropdown from '../../labels/KeyDropdown';
import LabelValueDropdown from '../../labels/ValueDropdown';
import { CommonAttributeValueInputProps } from './types';
import { isAnyOperator } from './common';

const LabelDropdownsDivider: FunctionComponent = () => {
    const { Divider } = Stage.Basic;
    return <Divider hidden style={{ margin: '0.2rem' }} />;
};

export interface LabelValueInputProps extends Omit<CommonAttributeValueInputProps, 'onChange' | 'value'> {
    labelKey: string;
    labelValue: string[];
    onKeyChange: (key: string) => void;
    onValueChange: (value: string[]) => void;
}

const LabelValueInput: FunctionComponent<LabelValueInputProps> = ({
    onKeyChange,
    onValueChange,
    operator,
    toolbox,
    labelKey,
    labelValue
}) => {
    const keyDropdownRef = useRef<HTMLElement>();

    return (
        <>
            <LabelKeyDropdown
                innerRef={keyDropdownRef}
                onChange={onKeyChange}
                toolbox={toolbox}
                value={labelKey}
                allowKnownOnly
            />
            {isAnyOperator(operator) && (
                <>
                    <LabelDropdownsDivider />
                    <LabelValueDropdown
                        labelKey={labelKey}
                        onChange={onValueChange}
                        toolbox={toolbox}
                        value={labelValue}
                        multiple
                        allowKnownOnly
                    />
                </>
            )}
        </>
    );
};

export default LabelValueInput;
