import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { Form } from 'cloudify-ui-components';
import { Icon } from 'semantic-ui-react';
import type { DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import type { Environment } from './EnvironmentDropdown.types';
import StageUtils from '../../../../utils/stageUtils';

const formatListItemText = (listItem: Environment) => {
    return StageUtils.formatDisplayName({ id: listItem.id, displayName: listItem.display_name });
};

const DATA_STATE = {
    LOADING: 'LOADING',
    EMPTY_LIST: 'EMPTY_LIST',
    ITEMS_LIST: 'ITEMS_LIST'
} as const;

interface EnvironmentDropdownListProps {
    environments: Environment[];
    onItemClick: DropdownItemProps['onClick'];
    activeEnvironmentId: DropdownProps['value'];
    isSuggestedList?: boolean;
    loading?: boolean;
}

const EnvironmentDropdownList = ({
    environments,
    onItemClick,
    activeEnvironmentId,
    isSuggestedList,
    loading
}: EnvironmentDropdownListProps) => {
    const listTitle = isSuggestedList ? 'Suggested' : 'Others';
    const dataState = useMemo<keyof typeof DATA_STATE>(() => {
        if (loading) {
            return DATA_STATE.LOADING;
        }

        if (isEmpty(environments)) {
            return DATA_STATE.EMPTY_LIST;
        }

        return DATA_STATE.ITEMS_LIST;
    }, [environments, loading]);

    return (
        <>
            <Form.Dropdown.Header>{listTitle}</Form.Dropdown.Header>

            {dataState === DATA_STATE.LOADING && (
                <Form.Dropdown.Item disabled>
                    <Icon name="spinner" loading />
                    fetching environments
                </Form.Dropdown.Item>
            )}

            {dataState === DATA_STATE.EMPTY_LIST && (
                <Form.Dropdown.Item disabled>
                    {/* TODO Norbert: To discuss with Alex */}
                    {/* <Icon name="close" /> */}
                    no environments
                </Form.Dropdown.Item>
            )}

            {dataState === DATA_STATE.ITEMS_LIST &&
                environments.map(environment => {
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
