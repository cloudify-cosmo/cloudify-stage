import { isEmpty } from 'lodash';
import StageUtils from '../../../utils/stageUtils';
import type { BlueprintRequirements } from '../blueprints/BlueprintActions';

interface DeployOnDropdownItem {
    id: string;
    // eslint-disable-next-line camelcase
    display_name: string;
}

export const deployOnTextFormatter = (item: DeployOnDropdownItem) => {
    return StageUtils.formatDisplayName({ id: item.id, displayName: item.display_name });
};

export const isDeployOnFunctionalityAvailable = (requirements: BlueprintRequirements | null) => {
    return !isEmpty(requirements?.parent_capabilities);
};
