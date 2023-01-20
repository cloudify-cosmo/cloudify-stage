import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { Form } from 'cloudify-ui-components';
import { Icon } from 'semantic-ui-react';
import type { Environment } from './EnvironmentDropdown.types';
import StageUtils from '../../../../utils/stageUtils';

const translate = StageUtils.getT(
    'widgets.common.deployments.deployModal.inputs.deploymentIdToDeployOn.environmentList'
);

const DATA_STATE = {
    LOADING: 'LOADING',
    EMPTY_LIST: 'EMPTY_LIST',
    ITEM_LIST: 'ITEM_LIST'
} as const;

export interface EnvironmentDropdownListProps {
    environments: Environment[];
    onItemClick: (environment: Environment) => void;
    activeEnvironmentId?: string;
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
    const listTitle = isSuggestedList ? translate('title.suggested') : translate('title.others');
    const dataState = useMemo<keyof typeof DATA_STATE>(() => {
        if (loading) {
            return DATA_STATE.LOADING;
        }

        if (isEmpty(environments)) {
            return DATA_STATE.EMPTY_LIST;
        }

        return DATA_STATE.ITEM_LIST;
    }, [environments, loading]);

    return (
        <>
            <Form.Dropdown.Header>{listTitle}</Form.Dropdown.Header>

            {dataState === DATA_STATE.LOADING && (
                <Form.Dropdown.Item disabled>
                    <Icon name="spinner" loading />
                    {translate('loading')}
                </Form.Dropdown.Item>
            )}

            {dataState === DATA_STATE.EMPTY_LIST && (
                <Form.Dropdown.Item disabled>{translate('noData')}</Form.Dropdown.Item>
            )}

            {dataState === DATA_STATE.ITEM_LIST &&
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

export default EnvironmentDropdownList;
