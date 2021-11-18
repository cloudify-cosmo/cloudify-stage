import _ from 'lodash';
import type { ThunkAction } from 'redux-thunk';
import type { AnyAction } from 'redux';

import type { SemanticICONS } from 'semantic-ui-react';
import * as types from './types';
import { addWidget } from './widgets';
import type { Widget, WidgetDefinition } from '../utils/StageAPI';
import type { ReduxState } from '../reducers';

// TODO(RD-1645): rename type to Widget
// TODO(RD-1649): rename the added field to `definitionId`
export type SimpleWidgetObj = Omit<Widget, 'definition'> & { definition: string };

export interface WidgetsSection {
    type: 'widgets';
    content: SimpleWidgetObj[];
}

export interface TabContent {
    name: string;
    widgets: SimpleWidgetObj[];
    isDefault?: boolean;
}

export interface TabsSection {
    type: 'tabs';
    content: TabContent[];
}

export type LayoutSection = WidgetsSection | TabsSection;

export function isWidgetsSection(layoutSection: LayoutSection): layoutSection is WidgetsSection {
    return layoutSection.type === 'widgets';
}
export function isTabsSection(layoutSection: LayoutSection): layoutSection is TabsSection {
    return layoutSection.type === 'tabs';
}

export interface PageDefinition {
    id: string;
    name: string;
    type: 'page';
    icon?: SemanticICONS;
    description: string;
    layout: LayoutSection[];
    isDrillDown: boolean;
    parent?: string;
    children?: string[];
}

export function addTab(pageId: string, layoutSection: number) {
    return {
        type: types.ADD_TAB,
        pageId,
        layoutSection
    } as const;
}

export function removeTab(pageId: string, layoutSection: number, tabIndex: number) {
    return {
        type: types.REMOVE_TAB,
        pageId,
        layoutSection,
        tabIndex
    } as const;
}

export function updateTab(pageId: string, layoutSection: number, tabIndex: number, name: string, isDefault: boolean) {
    return {
        type: types.UPDATE_TAB,
        pageId,
        layoutSection,
        tabIndex,
        name,
        isDefault
    } as const;
}

export function moveTab(pageId: string, layoutSection: number, oldTabIndex: number, newTabIndex: number) {
    return { type: types.MOVE_TAB, pageId, layoutSection, oldTabIndex, newTabIndex } as const;
}

export function forAllWidgets(
    page: Pick<PageDefinition, 'layout'>,
    widgetListModifier: (
        widget: SimpleWidgetObj[],
        layoutSectionIndex: number,
        tabIndex: number | null
    ) => (SimpleWidgetObj | null | undefined)[]
) {
    _.each(page.layout, (layoutSection, layoutSectionIdx) => {
        if (isWidgetsSection(layoutSection))
            layoutSection.content = _.compact(widgetListModifier(layoutSection.content, layoutSectionIdx, null));
        else
            _.each(layoutSection.content, (tab, tabIdx) => {
                tab.widgets = _.compact(widgetListModifier(tab.widgets, layoutSectionIdx, tabIdx));
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
        _.map(widgets, widget => widgetModifier(widget, layoutSectionIdx, tabIdx))
    );
}

export function getWidgetDefinitionById(
    definitionId: string,
    definitions: ReduxState['widgetDefinitions']
): WidgetDefinition | undefined {
    return _.find(definitions, { id: definitionId });
}

export function changePageDescription(pageId: string, newDescription: string) {
    return {
        type: types.CHANGE_PAGE_DESCRIPTION,
        pageId,
        description: newDescription
    };
}

export function addLayoutToPage(
    page: Pick<PageDefinition, 'layout'>,
    pageId: string
): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const { widgetDefinitions } = getState();
        forEachWidget(page, (widget, layoutSectionIdx, tabIdx) => {
            const widgetDefinition = _.find(widgetDefinitions, { id: widget.definition });
            dispatch(addWidget(pageId, layoutSectionIdx, tabIdx, widget, widgetDefinition));
            return widget;
        });
    };
}

export function addLayoutSectionToPage(pageId: string, layoutSection: LayoutSection, position: number) {
    return { type: types.ADD_LAYOUT_SECTION, pageId, layoutSection, position };
}

export function removeLayoutSectionFromPage(pageId: string, layoutSection: number) {
    return { type: types.REMOVE_LAYOUT_SECTION, pageId, layoutSection };
}
