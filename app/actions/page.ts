import { compact, each, find, map } from 'lodash';
import type { SemanticICONS } from 'semantic-ui-react';
import type {
    LayoutSection as BackendLayoutSection,
    TabContent as BackendTabContent,
    TabsSection as BackendTabsSection,
    WidgetsSection as BackendWidgetsSection
} from 'backend/handler/templates/types';
import type { AppDataPage } from 'backend/db/models/UserAppsModel.types';
import type { ReduxState } from '../reducers';
import type { Widget, WidgetDefinition } from '../utils/StageAPI';
import WidgetDefinitionsLoader from '../utils/widgetDefinitionsLoader';

import type { PayloadAction, ReduxThunkAction } from './types';
import { ActionType } from './types';
import { addWidget } from './widgets';
import type { EnhancedWidgetDefinition } from './widgetDefinitions';

// TODO(RD-1645): rename type to Widget
// TODO(RD-1649): rename the added field to `definitionId`
export type SimpleWidgetObj = Omit<Widget, 'definition'> & { definition: string };
export type WidgetsSection = BackendWidgetsSection<SimpleWidgetObj>;
export type TabContent = BackendTabContent<SimpleWidgetObj>;
export type TabsSection = BackendTabsSection<SimpleWidgetObj>;
export type LayoutSection = BackendLayoutSection<SimpleWidgetObj>;

export function isWidgetsSection(layoutSection: LayoutSection): layoutSection is WidgetsSection {
    return layoutSection.type === 'widgets';
}
export function isTabsSection(layoutSection: LayoutSection): layoutSection is TabsSection {
    return layoutSection.type === 'tabs';
}

export interface PageDefinition extends Omit<AppDataPage, 'icon' | 'layout'> {
    icon?: SemanticICONS;
    isDrillDown: boolean;
    parent?: string;
    children?: string[];
    layout: LayoutSection[];
}

export type AddTabAction = PayloadAction<{ pageId: string; layoutSectionIndex: number }, ActionType.ADD_TAB>;
export type RemoveTabAction = PayloadAction<
    { pageId: string; layoutSectionIndex: number; tabIndex: number },
    ActionType.REMOVE_TAB
>;
export type UpdateTabAction = PayloadAction<
    { pageId: string; layoutSectionIndex: number; tabIndex: number; name: string; isDefault: boolean },
    ActionType.UPDATE_TAB
>;
export type MoveTabAction = PayloadAction<
    { pageId: string; layoutSectionIndex: number; oldTabIndex: number; newTabIndex: number },
    ActionType.MOVE_TAB
>;
export type ChangePageDescriptionAction = PayloadAction<
    { pageId: string; description: string },
    ActionType.CHANGE_PAGE_DESCRIPTION
>;
export type AddLayoutSectionAction = PayloadAction<
    { pageId: string; layoutSection: LayoutSection; index: number },
    ActionType.ADD_LAYOUT_SECTION
>;
export type RemoveLayoutSectionAction = PayloadAction<
    { pageId: string; layoutSectionIndex: number },
    ActionType.REMOVE_LAYOUT_SECTION
>;

export type TabAction = AddTabAction | RemoveTabAction | UpdateTabAction | MoveTabAction;
export type LayoutSectionAction = ChangePageDescriptionAction | AddLayoutSectionAction | RemoveLayoutSectionAction;

export function addTab(pageId: string, layoutSectionIndex: number): AddTabAction {
    return {
        type: ActionType.ADD_TAB,
        payload: { pageId, layoutSectionIndex }
    } as const;
}

export function removeTab(pageId: string, layoutSectionIndex: number, tabIndex: number): RemoveTabAction {
    return {
        type: ActionType.REMOVE_TAB,
        payload: { pageId, layoutSectionIndex, tabIndex }
    } as const;
}

export function updateTab(
    pageId: string,
    layoutSectionIndex: number,
    tabIndex: number,
    name: string,
    isDefault: boolean
): UpdateTabAction {
    return {
        type: ActionType.UPDATE_TAB,
        payload: { pageId, layoutSectionIndex, tabIndex, name, isDefault }
    } as const;
}

export function moveTab(
    pageId: string,
    layoutSectionIndex: number,
    oldTabIndex: number,
    newTabIndex: number
): MoveTabAction {
    return {
        type: ActionType.MOVE_TAB,
        payload: { pageId, layoutSectionIndex, oldTabIndex, newTabIndex }
    } as const;
}

export function forAllWidgets(
    page: Pick<PageDefinition, 'layout'>,
    widgetListModifier: (
        widget: SimpleWidgetObj[],
        layoutSectionIndex: number,
        tabIndex: number | null
    ) => (SimpleWidgetObj | null | undefined)[]
) {
    each(page.layout, (layoutSection, layoutSectionIdx) => {
        if (isWidgetsSection(layoutSection))
            layoutSection.content = compact(widgetListModifier(layoutSection.content, layoutSectionIdx, null));
        else
            each(layoutSection.content, (tab, tabIdx) => {
                tab.widgets = compact(widgetListModifier(tab.widgets, layoutSectionIdx, tabIdx));
            });
    });
}

export function forEachWidget(
    page: Pick<PageDefinition, 'layout'>,
    widgetModifier: (
        widget: SimpleWidgetObj,
        layoutSectionIndex: number,
        tabIndex: number | null
    ) => SimpleWidgetObj | null | undefined
) {
    forAllWidgets(page, (widgets, layoutSectionIdx, tabIdx) =>
        map(widgets, widget => widgetModifier(widget, layoutSectionIdx, tabIdx))
    );
}

export function getWidgetDefinitionById(
    definitionId: string,
    definitions: ReduxState['widgetDefinitions']
): WidgetDefinition | undefined {
    return find(definitions, { id: definitionId });
}

export function changePageDescription(pageId: string, description: string): ChangePageDescriptionAction {
    return {
        type: ActionType.CHANGE_PAGE_DESCRIPTION,
        payload: { pageId, description }
    };
}

export function addLayoutToPage(page: Pick<PageDefinition, 'layout'>, pageId: string): ReduxThunkAction {
    return (dispatch, getState) => {
        const { widgetDefinitions } = getState();
        const widgetsToLoad: Record<string, EnhancedWidgetDefinition> = {};
        forEachWidget(page, widget => {
            const widgetDefinition = find(widgetDefinitions, { id: widget.definition });
            if (widgetDefinition && !widgetDefinition.loaded) {
                widgetsToLoad[widgetDefinition.id] = widgetDefinition;
            }
            return widget;
        });
        const promises = map(widgetsToLoad, widgetToLoad => WidgetDefinitionsLoader.loadWidget(widgetToLoad));
        return Promise.all(promises).then(loadedWidgetDefinitions => {
            forEachWidget(page, (widget, layoutSectionIdx, tabIdx) => {
                const widgetDefinition =
                    find(loadedWidgetDefinitions, { id: widget.definition }) ??
                    find(getState().widgetDefinitions, { id: widget.definition });
                if (widgetDefinition) dispatch(addWidget(pageId, layoutSectionIdx, tabIdx, widget, widgetDefinition));
                return widget;
            });
        });
    };
}

export function addLayoutSectionToPage(
    pageId: string,
    layoutSection: LayoutSection,
    index: number
): AddLayoutSectionAction {
    return {
        type: ActionType.ADD_LAYOUT_SECTION,
        payload: { pageId, layoutSection, index }
    };
}

export function removeLayoutSectionFromPage(pageId: string, layoutSectionIndex: number): RemoveLayoutSectionAction {
    return {
        type: ActionType.REMOVE_LAYOUT_SECTION,
        payload: { pageId, layoutSectionIndex }
    };
}
