import { FilterRuleOperator } from '../types';

export interface CommonAttributeValueInputProps {
    onChange: (value: string[]) => void;
    operator: FilterRuleOperator;
    toolbox: Stage.Types.Toolbox | Stage.Types.WidgetlessToolbox;
    value: string[];
}
