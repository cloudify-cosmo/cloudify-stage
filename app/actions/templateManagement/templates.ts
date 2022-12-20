import type { PageItem } from 'backend/handler/templates/types';
import type { PayloadAction } from '../types';
import { ActionType } from '../types';

type Pages = PageItem[];

export type AddTemplateAction = PayloadAction<{ templateId: string; pages: Pages }, ActionType.ADD_TEMPLATE>;
export type EditTemplateAction = PayloadAction<{ templateId: string; pages: Pages }, ActionType.EDIT_TEMPLATE>;
export type RemoveTemplateAction = PayloadAction<string, ActionType.REMOVE_TEMPLATE>;
export type TemplateAction = AddTemplateAction | EditTemplateAction | RemoveTemplateAction;

export function addTemplate(templateId: string, pages: Pages): AddTemplateAction {
    return {
        type: ActionType.ADD_TEMPLATE,
        payload: { templateId, pages }
    };
}

export function editTemplate(templateId: string, pages: Pages): EditTemplateAction {
    return {
        type: ActionType.EDIT_TEMPLATE,
        payload: { templateId, pages }
    };
}

export function removeTemplate(templateId: string): RemoveTemplateAction {
    return {
        type: ActionType.REMOVE_TEMPLATE,
        payload: templateId
    };
}
