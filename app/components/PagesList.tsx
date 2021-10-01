import type { FunctionComponent } from 'react';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import _ from 'lodash';

import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import AddPageButton from '../containers/AddPageButton';
import { Icon } from './basic';
import Consts from '../utils/consts';

import SortableMenuItem from './SortableMenuItem';

import type { PageDefinition, PageMenuItem } from '../actions/page';

export interface PagesListProps {
    onPageSelected: (page: PageDefinition) => void;
    onPageRemoved: (page: PageDefinition) => void;
    onPageReorder: (index: number, newIndex: number) => void;
    pages: PageMenuItem[];
    selected?: string;
    isEditMode: boolean;
}

function drillDownPagesFilter(pageMenuItem: PageMenuItem) {
    return pageMenuItem.type === 'pageGroup' || !pageMenuItem.isDrillDown;
}

const PagesList: FunctionComponent<PagesListProps> = ({
    isEditMode,
    onPageRemoved,
    onPageReorder,
    onPageSelected,
    pages,
    selected = ''
}) => {
    const [expandedGroupIds, setExpandedGroupIds] = useState<string[]>([]);
    const pageIds = useMemo(() => pages.filter(drillDownPagesFilter).map(({ id }) => id), [pages]);
    const sensors = useSensors(useSensor(PointerSensor));
    const pageCount = pageIds.length;

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (active && over && active.id !== over.id) {
                const oldIndex = pageIds.indexOf(active.id);
                const newIndex = pageIds.indexOf(over.id);

                onPageReorder(oldIndex, newIndex);
            }
        },
        [pageIds]
    );

    function onPageGroupClick(clickedPageGroupId: string) {
        if (_.includes(expandedGroupIds, clickedPageGroupId))
            setExpandedGroupIds(_.without(expandedGroupIds, clickedPageGroupId));
        else setExpandedGroupIds([...expandedGroupIds, clickedPageGroupId]);
    }

    function renderPageMenuItem(pageMenuItem: PageMenuItem, subItem = false): ReactNode[] {
        const renderedMenuItem = (
            <SortableMenuItem
                id={pageMenuItem.id}
                as="a"
                link
                key={pageMenuItem.id}
                href={`${Consts.CONTEXT_PATH}/page/${pageMenuItem.id}`}
                active={selected === pageMenuItem.id}
                className={`pageMenuItem ${pageMenuItem.id}PageMenuItem`}
                onClick={event => {
                    event.stopPropagation();
                    event.preventDefault();
                    if (pageMenuItem.type === 'page') onPageSelected(pageMenuItem);
                    else onPageGroupClick(pageMenuItem.id);
                }}
                style={subItem ? { paddingLeft: 25 } : undefined}
            >
                {pageMenuItem.name}
                {isEditMode && pageMenuItem.type === 'page' && pageCount > 1 ? (
                    <Icon
                        name="remove"
                        size="small"
                        className="pageRemoveButton"
                        onClick={(event: MouseEvent) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onPageRemoved(pageMenuItem);
                        }}
                    />
                ) : (
                    ''
                )}
                {pageMenuItem.type === 'pageGroup' && (
                    <Icon
                        name="dropdown"
                        rotated={_.includes(expandedGroupIds, pageMenuItem.id) ? undefined : 'counterclockwise'}
                    />
                )}
            </SortableMenuItem>
        );

        if (pageMenuItem.type === 'page' || !_.includes(expandedGroupIds, pageMenuItem.id)) return [renderedMenuItem];
        return [renderedMenuItem, ...pageMenuItem.pages.map(childItem => renderPageMenuItem(childItem, true))];
    }

    return (
        <>
            <DndContext
                sensors={isEditMode ? sensors : []}
                collisionDetection={closestCenter}
                onDragEnd={isEditMode ? handleDragEnd : undefined}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext items={pageIds} strategy={verticalListSortingStrategy}>
                    <div className="pages">
                        {_(pages)
                            .filter(drillDownPagesFilter)
                            .map(pageMenuItem => renderPageMenuItem(pageMenuItem, false))
                            .flatten()
                            .value()}
                    </div>
                </SortableContext>
            </DndContext>
            {isEditMode && (
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                    {/* @ts-expect-error until the AddPageButton not fully migrated to ts */}
                    <AddPageButton />
                </div>
            )}
        </>
    );
};

export default PagesList;
