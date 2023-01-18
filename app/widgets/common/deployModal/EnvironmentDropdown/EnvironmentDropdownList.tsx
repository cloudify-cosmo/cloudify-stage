import React from 'react';
import { Form } from 'cloudify-ui-components';
import type { DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import type { Environment } from './EnvironmentDropdown.types';
import StageUtils from '../../../../utils/stageUtils';

const formatListItemText = (listItem: Environment) => {
    return StageUtils.formatDisplayName({ id: listItem.id, displayName: listItem.display_name });
};

interface EnvironmentDropdownListProps {
    environments: Environment[];
    onItemClick: DropdownItemProps['onClick'];
    activeEnvironmentId: DropdownProps['value'];
    isSuggestedList?: boolean;
}

const EnvironmentDropdownList = ({
    environments,
    onItemClick,
    activeEnvironmentId,
    isSuggestedList
}: EnvironmentDropdownListProps) => {
    const listTitle = isSuggestedList ? 'Suggested' : 'Others';

    return (
        <>
            <Form.Dropdown.Header>{listTitle}</Form.Dropdown.Header>
            {environments.map(environment => {
                return (
                    <Form.Dropdown.Item
                        key={environment.id}
                        active={environment.id === activeEnvironmentId}
                        value={environment.id}
                        onClick={onItemClick}
                    >
                        {formatListItemText(environment)}
                    </Form.Dropdown.Item>
                );
            })}
        </>
    );
};

export default EnvironmentDropdownList;
