import type { DropdownItemProps } from 'semantic-ui-react';
import StageUtils from '../../../utils/stageUtils';
import type { FetchedOption } from './EnvironmentDropdown';

const formatDropdownItemText = (item: FetchedOption) => {
    return StageUtils.formatDisplayName({ id: item.id, displayName: item.display_name });
};

export const mapFetchedOptions = (items: FetchedOption[]): DropdownItemProps[] => {
    return items.map(item => {
        return {
            text: formatDropdownItemText(item),
            value: item.id,
            title: item.display_name
        };
    });
};
