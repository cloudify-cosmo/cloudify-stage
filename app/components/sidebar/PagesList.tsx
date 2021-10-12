// @ts-nocheck File not migrated fully to TS
import type { FunctionComponent } from 'react';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { chain, find, includes, map, without } from 'lodash';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { connect, useDispatch } from 'react-redux';

import { Icon } from '../basic';
import AddPageButton from './AddPageButton';
import AddPageGroupButton from './AddPageGroupButton';
import SortableMenuItem from './SortableMenuItem';

import type { PageDefinition, PageMenuItem } from '../../actions/page';
import Consts from '../../utils/consts';
import { useBoolean } from '../../utils/hooks';

import {
    createPagesMap,
    InsertPosition,
    removePageWithChildren,
    removeSinglePageMenuItem,
    reorderPageMenu,
    selectPage
} from '../../actions/page';

export interface PagesListProps {
    onPageSelected: (page: PageDefinition) => void;
    onItemRemoved: (page: PageMenuItem) => void;
    pages: PageMenuItem[];
    selected?: string;
    isEditMode: boolean;
}

function drillDownPagesFilter(pageMenuItem: PageMenuItem) {
    return pageMenuItem.type === 'pageGroup' || !pageMenuItem.isDrillDown;
}

const PagesList: FunctionComponent<PagesListProps> = ({
    isEditMode,
    onItemRemoved,
    onPageSelected,
    pages,
    selected = ''
}) => {
    const [expandedGroupIds, setExpandedGroupIds] = useState<string[]>([]);
    const pageMenuItemsIds = useMemo(
        () =>
            chain(pages)
                .filter(drillDownPagesFilter)
                .map(pageMenuItem =>
                    pageMenuItem.type === 'page' || !includes(expandedGroupIds, pageMenuItem.id)
                        ? pageMenuItem.id
                        : [pageMenuItem.id, ...map(pageMenuItem.pages, 'id')]
                )
                .flatten()
                .value(),
        [pages, expandedGroupIds]
    );
    const pageIds = useMemo(() => pages.filter(drillDownPagesFilter).map(({ id }) => id), [pages]);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 1 } }));
    const pageCount = pageIds.length;
    const [dragForbidden, setDragForbidden, unsetDragForbidden] = useBoolean();
    const [dragging, setDragging, unsetDragging] = useBoolean();
    const dispatch = useDispatch();

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            if (!dragForbidden) {
                const { active, over } = event;
                if (active && over && active.id !== over.id) {
                    const sourceId = active.id;
                    const targetId = over.id;
                    let insertPosition = event.delta.y > 0 ? InsertPosition.After : InsertPosition.Before;

                    if (
                        insertPosition === InsertPosition.After &&
                        getPageMenuItem(targetId).type === 'pageGroup' &&
                        includes(expandedGroupIds, targetId)
                    ) {
                        insertPosition = InsertPosition.Into;
                    }
                    dispatch(reorderPageMenu(sourceId, targetId, insertPosition));
                }
            }
            unsetDragForbidden();
            unsetDragging();
        },
        [pageIds, dragForbidden, expandedGroupIds]
    );

    function getPageMenuItem(id: string) {
        return find(pages, { id }) ?? _(pages).flatMap('pages').find({ id });
    }

    const handleDragOver = useCallback(
        ({ active, over, delta }: DragOverEvent) => {
            const activeItem = getPageMenuItem(active.id);
            if (activeItem.type === 'pageGroup' && over && over.id !== active.id) {
                const overItem = getPageMenuItem(over.id);

                const overExpandedGroupHeader =
                    overItem.type === 'pageGroup' && includes(expandedGroupIds, overItem.id);

                if (overExpandedGroupHeader && delta.y > 0) {
                    setDragForbidden();
                    return;
                }

                const overGroupItem = find(
                    pages,
                    pageMenuItem => pageMenuItem.type === 'pageGroup' && find(pageMenuItem.pages, { id: overItem.id })
                );

                if (overGroupItem) {
                    setDragForbidden();
                    return;
                }
            }
            unsetDragForbidden();
        },
        [pages, expandedGroupIds]
    );

    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            setDragging();
            const activePageMenuItem = getPageMenuItem(event.active.id);
            if (activePageMenuItem.type === 'pageGroup' && includes(expandedGroupIds, activePageMenuItem.id)) {
                setExpandedGroupIds(without(expandedGroupIds, activePageMenuItem.id));
            }
        },
        [pages, expandedGroupIds]
    );

    function onPageGroupClick(clickedPageGroupId: string) {
        if (includes(expandedGroupIds, clickedPageGroupId))
            setExpandedGroupIds(without(expandedGroupIds, clickedPageGroupId));
        else setExpandedGroupIds([...expandedGroupIds, clickedPageGroupId]);
    }

    function renderPageMenuItem(pageMenuItem: PageMenuItem, subItem = false): ReactNode[] {
        const renderedMenuItem = (
            <SortableMenuItem
                id={pageMenuItem.id}
                as={isEditMode ? 'span' : 'a'}
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
                style={{ paddingLeft: subItem ? 25 : undefined, cursor: dragging ? 'inherit' : undefined }}
            >
                {pageMenuItem.name}
                {isEditMode && (
                    <>
                        <Icon
                            name="edit"
                            size="small"
                            style={{ float: 'none' }}
                            onClick={(event: MouseEvent) => {
                                event.preventDefault();
                                event.stopPropagation();
                            }}
                        />
                        {pageCount > 1 && (
                            <Icon
                                name="remove"
                                size="small"
                                className="pageRemoveButton"
                                onClick={(event: MouseEvent) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    onItemRemoved(pageMenuItem);
                                }}
                            />
                        )}
                    </>
                )}
                {pageMenuItem.type === 'pageGroup' && (
                    <Icon
                        name="dropdown"
                        rotated={includes(expandedGroupIds, pageMenuItem.id) ? undefined : 'counterclockwise'}
                    />
                )}
            </SortableMenuItem>
        );

        if (pageMenuItem.type === 'page' || !includes(expandedGroupIds, pageMenuItem.id)) return [renderedMenuItem];
        return [renderedMenuItem, ...pageMenuItem.pages.map(childItem => renderPageMenuItem(childItem, true))];
    }

    let cursor;
    if (dragForbidden) cursor = 'not-allowed';
    else if (dragging) cursor = 'grabbing';

    const pagesContainer = (
        <div className="pages" style={{ cursor }}>
            {chain(pages)
                .filter(drillDownPagesFilter)
                .map(pageMenuItem => renderPageMenuItem(pageMenuItem, false))
                .flatten()
                .value()}
        </div>
    );

    if (isEditMode) {
        return (
            <>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext items={pageMenuItemsIds} strategy={verticalListSortingStrategy}>
                        {pagesContainer}
                    </SortableContext>
                </DndContext>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                    {/* @ts-expect-error until the AddPageButton not fully migrated to ts */}
                    <AddPageButton />
                    <AddPageGroupButton />
                </div>
            </>
        );
    }

    return pagesContainer;
};

const findSelectedRootPageId = (pagesMap, selectedPageId) => {
    const getParentPageId = page => {
        if (!page.parent) {
            return page.id;
        }
        return getParentPageId(pagesMap[page.parent]);
    };

    return getParentPageId(pagesMap[selectedPageId]);
};

const mapStateToProps = (state, ownProps) => {
    const { pages } = state;
    const pagesMap = createPagesMap(pages);
    const page = pagesMap[ownProps.pageId];
    const homePageId = pages[0].id;
    const pageId = page ? page.id : homePageId;
    const selected = pages && pages.length > 0 ? findSelectedRootPageId(pagesMap, pageId) : null;

    return {
        pages,
        selected
    };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {
        ...ownProps,
        ...dispatchProps,
        ...stateProps,
        onItemRemoved: pageListItem => {
            dispatchProps.onItemRemoved(pageListItem, stateProps.pages);
        }
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onPageSelected: page => {
            dispatch(selectPage(page.id, page.isDrillDown));
        },
        onItemRemoved: (pageListItem, pages) => {
            const pagesMap = createPagesMap(pages);
            const selectedRootPageId = findSelectedRootPageId(pagesMap, ownProps.pageId);

            if (pageListItem.type === 'page') {
                // Check if user removes current page
                if (selectedRootPageId === pageListItem.id) {
                    // Check if current page is home page
                    if (selectedRootPageId === ownProps.homePageId) {
                        dispatch(selectPage(pages[1].id, false));
                    } else {
                        dispatch(selectPage(ownProps.homePageId, false));
                    }
                }

                dispatch(removePageWithChildren(pageListItem));
            } else {
                // Check if current page is in group being removed
                if (includes(pageListItem.pages, selectedRootPageId)) {
                    // Select first page that is not in the group
                    dispatch(selectPage(find(pagesMap, page => !includes(pageListItem.pages, page)).id));
                }

                dispatch(removeSinglePageMenuItem(pageListItem.id));
            }
        }
    };
};

const ConnectedPagesList = connect(mapStateToProps, mapDispatchToProps, mergeProps)(PagesList);

export default ConnectedPagesList;
