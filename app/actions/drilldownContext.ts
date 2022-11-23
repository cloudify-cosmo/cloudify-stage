import type { PayloadAction } from './types';
import { ActionType } from './types';

export interface DrilldownContext {
    pageName?: string;
    context?: Record<string, any>;
}

export type SetDrilldownContextAction = PayloadAction<DrilldownContext[], ActionType.SET_DRILLDOWN_CONTEXT>;
export type PopDrilldownContextAction = PayloadAction<number, ActionType.POP_DRILLDOWN_CONTEXT>;
export type DrilldownContextAction = SetDrilldownContextAction | PopDrilldownContextAction;

export function setDrilldownContext(drilldownContext: DrilldownContext[]): SetDrilldownContextAction {
    return {
        type: ActionType.SET_DRILLDOWN_CONTEXT,
        payload: drilldownContext
    };
}

export function popDrilldownContext(count = 1): PopDrilldownContextAction {
    return {
        type: ActionType.POP_DRILLDOWN_CONTEXT,
        payload: count
    };
}
