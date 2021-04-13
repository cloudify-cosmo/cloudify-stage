import { FilterRuleOperator } from '../types';

export interface CommonAttributeValueInputProps {
    onChange: (value: string[]) => void;
    operator: FilterRuleOperator;
    toolbox: Stage.Types.Toolbox;
    value: string[];
}
