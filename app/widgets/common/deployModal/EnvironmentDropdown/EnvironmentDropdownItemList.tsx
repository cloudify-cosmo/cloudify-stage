import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { Form } from 'cloudify-ui-components';
import { Icon } from 'semantic-ui-react';
import type { Environment } from './EnvironmentDropdown.types';
import StageUtils from '../../../../utils/stageUtils';

const translate = StageUtils.getT(
    'widgets.common.deployments.deployModal.inputs.deploymentIdToDeployOn.environmentList'
);

enum DataState {
    LOADING,
    EMPTY_LIST,
    ITEM_LIST
}

export interface EnvironmentDropdownItemListProps {
    environments: Environment[];
    onItemClick: (environment: Environment) => void;
    activeEnvironmentId?: string;
    isSuggestedList?: boolean;
    loading?: boolean;
}

const EnvironmentDropdownItemList = ({
    environments,
    onItemClick,
    activeEnvironmentId,
    isSuggestedList,
    loading
}: EnvironmentDropdownItemListProps) => {
    const listTitle = isSuggestedList ? translate('title.suggested') : translate('title.others');
    const dataState = useMemo<DataState>(() => {
        if (loading) {
            return DataState.LOADING;
        }

        if (isEmpty(environments)) {
            return DataState.EMPTY_LIST;
        }

        return DataState.ITEM_LIST;
    }, [environments, loading]);

    return (
        <>
            <Form.Dropdown.Header>{listTitle}</Form.Dropdown.Header>

            {dataState === DataState.LOADING && (
                <Form.Dropdown.Item disabled>
                    <Icon name="spinner" loading />
                    {translate('loading')}
                </Form.Dropdown.Item>
            )}

            {dataState === DataState.EMPTY_LIST && (
                <Form.Dropdown.Item disabled>{translate('noData')}</Form.Dropdown.Item>
            )}

            {dataState === DataState.ITEM_LIST &&
                environments.map(environment => {
                    return (
                        <Form.Dropdown.Item
                            key={environment.id}
                            active={environment.id === activeEnvironmentId}
                            value={environment.id}
                            onClick={() => onItemClick(environment)}
                            text={environment.displayName}
                        />
                    );
                })}
        </>
    );
};

export default EnvironmentDropdownItemList;
