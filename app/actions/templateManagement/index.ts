import * as types from '../types';

export function setTemplateManagementActive(isActive: boolean) {
    return { type: types.TEMPLATE_MANAGEMENT_ACTIVE, isActive };
}
