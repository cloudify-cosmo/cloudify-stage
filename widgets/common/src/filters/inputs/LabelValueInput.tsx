import type { FunctionComponent } from 'react';
import { useRef } from 'react';

import { FilterRuleOperator, LabelsFilterRuleOperators } from '../types';
import LabelKeyDropdown from '../../labels/KeyDropdown';
import LabelValueDropdown from '../../labels/ValueDropdown';
import { CommonAttributeValueInputProps } from './types';

export interface LabelValueInputProps extends Omit<CommonAttributeValueInputProps, 'onChange' | 'value'> {
    labelKey: string;
    labelValue: string[];
    onKeyChange: (key: string) => void;
    onValueChange: (value: string[]) => void;
}

const operatorsWithValues: FilterRuleOperator[] = [LabelsFilterRuleOperators.AnyOf, LabelsFilterRuleOperators.NotAnyOf];

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
        // TODO(RD-2007): Add better styling
        <>
            <LabelKeyDropdown
                innerRef={keyDropdownRef}
                onChange={onKeyChange}
                toolbox={toolbox}
                value={labelKey}
                readOnly
            />
            {operatorsWithValues.includes(operator) && (
                <LabelValueDropdown
                    labelKey={labelKey}
                    onChange={onValueChange}
                    toolbox={toolbox}
                    value={labelValue}
                    multiple
                    readOnly
                />
            )}
        </>
    );
};

export default LabelValueInput;
