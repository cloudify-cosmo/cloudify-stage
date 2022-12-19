import StageUtils from '../../../utils/stageUtils';

interface DeployOnDropdownItem {
    id: string;
    // eslint-disable-next-line camelcase
    display_name: string;
}

export const deployOnTextFormatter = (item: DeployOnDropdownItem) => {
    return StageUtils.formatDisplayName({ id: item.id, displayName: item.display_name });
};
