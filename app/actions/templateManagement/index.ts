import { ActionType } from '../types';

export function setTemplateManagementActive(isActive: boolean) {
    return { type: ActionType.TEMPLATE_MANAGEMENT_ACTIVE, isActive };
}
