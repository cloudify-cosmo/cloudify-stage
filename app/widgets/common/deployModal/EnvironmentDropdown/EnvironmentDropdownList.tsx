import React from 'react';
import { Form } from 'cloudify-ui-components';
import type { DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import { formatDropdownItemText } from './EnvironmentDropdown.utils';
import type { FetchedDeployment } from './EnvironmentDropdown.types';

interface EnvironmentDropdownListProps {
    environments: FetchedDeployment[];
    onItemClick: DropdownItemProps['onClick'];
    dropdownValue: DropdownProps['value'];
    isSuggestedList?: boolean;
}

const EnvironmentDropdownList = ({
    environments,
    onItemClick,
    dropdownValue,
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
                        active={environment.id === dropdownValue}
                        value={environment.id}
                        onClick={onItemClick}
                    >
                        {formatDropdownItemText(environment)}
                    </Form.Dropdown.Item>
                );
            })}
        </>
    );
};

export default EnvironmentDropdownList;
