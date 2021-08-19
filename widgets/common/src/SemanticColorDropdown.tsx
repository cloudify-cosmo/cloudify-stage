import React, { ComponentProps, FunctionComponent } from 'react';
import type { SemanticCOLORS } from 'semantic-ui-react';

type SemanticColorDropdownProps = Pick<
    Stage.Types.CustomConfigurationComponentProps<string>,
    'name' | 'onChange' | 'value'
>;

const { Dropdown } = Stage.Basic;
const semanticColors: SemanticCOLORS[] = [
    'red',
    'orange',
    'yellow',
    'olive',
    'green',
    'teal',
    'blue',
    'violet',
    'purple',
    'pink',
    'brown',
    'grey',
    'black'
];
const semanticColorsOptions: ComponentProps<typeof Dropdown>['options'] = semanticColors.map(color => ({
    key: color,
    text: color,
    value: color,
    icon: { name: 'circle', color }
}));

const SemanticColorDropdown: FunctionComponent<SemanticColorDropdownProps> = ({ name, value, onChange }) => {
    const handleChange: ComponentProps<typeof Dropdown>['onChange'] = (event, data) => {
        onChange(event, {
            name,
            value: data.value as string
        });
    };

    return (
        <Dropdown name={name} onChange={handleChange} options={semanticColorsOptions} search selection value={value} />
    );
};

export default SemanticColorDropdown;

declare global {
    namespace Stage.Common {
        export { SemanticColorDropdown };
    }
}

Stage.defineCommon({
    name: 'SemanticColorDropdown',
    common: SemanticColorDropdown
});
