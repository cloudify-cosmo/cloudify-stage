import type { PayloadAction } from '../types';
import { ActionType } from '../types';
import type { TemplateAction } from './templates';
import type { PageAction } from './pages';
import type { PageGroupAction } from './pageGroups';

export type SetTemplateManagementActiveAction = PayloadAction<boolean, ActionType.TEMPLATE_MANAGEMENT_ACTIVE>;
export type TemplateManagementAction =
    | TemplateAction
    | PageAction
    | PageGroupAction
    | SetTemplateManagementActiveAction;

export function setTemplateManagementActive(isActive: boolean): SetTemplateManagementActiveAction {
    return { type: ActionType.TEMPLATE_MANAGEMENT_ACTIVE, payload: isActive };
}
