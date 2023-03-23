import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { Form } from 'cloudify-ui-components';
import { Icon } from 'semantic-ui-react';
import type { FetchedBlueprint } from './SuggestedBlueprintDropdown.types';
import StageUtils from '../../../../utils/stageUtils';

const translate = StageUtils.getT('widgets.common.deployments.deployModal.inputs.deploymentIdToDeployOn.blueprintList');

enum DataState {
    LOADING,
    EMPTY_LIST,
    ITEM_LIST
}

export interface BlueprintDropdownItemListProps {
    blueprints: FetchedBlueprint[];
    onItemClick: (blueprint: FetchedBlueprint) => void;
    activeBlueprintId?: string;
    isSuggestedList?: boolean;
    loading?: boolean;
}

const BlueprintDropdownItemList = ({
    blueprints,
    onItemClick,
    activeBlueprintId,
    isSuggestedList,
    loading
}: BlueprintDropdownItemListProps) => {
    const listTitle = isSuggestedList ? translate('title.suggested') : translate('title.others');
    const dataState = useMemo<DataState>(() => {
        if (loading) {
            return DataState.LOADING;
        }

        if (isEmpty(blueprints)) {
            return DataState.EMPTY_LIST;
        }

        return DataState.ITEM_LIST;
    }, [blueprints, loading]);

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
                blueprints.map(blueprint => {
                    return (
                        <Form.Dropdown.Item
                            key={blueprint.id}
                            active={blueprint.id === activeBlueprintId}
                            value={blueprint.id}
                            onClick={() => onItemClick(blueprint)}
                            text={blueprint.id}
                        />
                    );
                })}
        </>
    );
};

export default BlueprintDropdownItemList;
