import type { ComponentProps, FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import type { SemanticCOLORS } from 'semantic-ui-react';
import { useBoolean } from '../../../utils/hooks';
import { Dropdown, Icon } from '../../../components/basic';

type SemanticColorDropdownProps = Pick<
    Stage.Types.CustomConfigurationComponentProps<string>,
    'name' | 'onChange' | 'value'
>;

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
