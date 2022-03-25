import React, { ComponentProps, FunctionComponent, useMemo } from 'react';
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
    const { Icon } = Stage.Basic;
    const { useBoolean } = Stage.Hooks;
    const [isOpen, setOpen, unsetOpen] = useBoolean();

    const handleChange: ComponentProps<typeof Dropdown>['onChange'] = (event, data) => {
        onChange(event, {
            name,
            value: data.value as string
        });
    };

    const trigger = useMemo(
        () =>
            !isOpen &&
            value && (
                <>
                    <Icon name="circle" color={value as SemanticCOLORS} /> {value}
                </>
            ),
        [isOpen, value]
    );

    return (
        <Dropdown
            name={name}
            onChange={handleChange}
            onClose={unsetOpen}
            onOpen={setOpen}
            options={semanticColorsOptions}
            search
            selection
            trigger={trigger}
            value={value}
        />
    );
};

const memoizedSemanticColorDropdown = React.memo(SemanticColorDropdown, _.isEqual);
export default memoizedSemanticColorDropdown;
