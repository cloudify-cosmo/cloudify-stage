import type { CSSProperties, FunctionComponent, ReactNode } from 'react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { chain, find, includes, map } from 'lodash';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import type { SemanticICONS } from 'semantic-ui-react';
import { EditableLabel, Icon } from '../basic';
import AddPageButton from './AddPageButton';
import AddPageGroupButton from './AddPageGroupButton';
import SortableMenuItem from './SortableMenuItem';

import type { PageDefinition } from '../../actions/page';
import type { PageGroup, PageMenuItem } from '../../actions/pageMenu';
import {
    changePageMenuItemIcon,
    changePageMenuItemName,
    createPagesMap,
    findSelectedRootPageId,
    InsertPosition,
    removePageMenuItem,
    reorderPageMenu,
    selectPage
} from '../../actions/pageMenu';
import Consts from '../../utils/consts';
import { useBoolean, useResettableState } from '../../utils/hooks';
import type { ReduxState } from '../../reducers';
import IconSelection from './IconSelection';
import { SideBarItemWrapper, sideBarItemFontSize } from './SideBarItem';

export interface PagesListProps {
    pageId: string;
    expandedGroupIds: string[];
    onGroupCollapse: (groupId: string) => void;
    onGroupExpand: (groupId: string) => void;
}

function drillDownPagesFilter(pageMenuItem: PageMenuItem) {
    return pageMenuItem.type === 'pageGroup' || !pageMenuItem.isDrillDown;
}

function consumeEvent(event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
}
interface RemoveIconProps {
    isSubItem: boolean;
}

const RemoveIcon = styled(Icon)<RemoveIconProps>`
    position: absolute;
    top: 15px;
    right: 2px;
    visibility: hidden;
    float: right;
    line-height: 8px !important;
    font-size: 10px !important;
    ${SideBarItemWrapper}:hover & {
        visibility: visible;
    }

    ${({ isSubItem }) =>
        isSubItem &&
        css`
            right: 10px;
            top: 0;
        `}
`;

const EditIcon = styled(Icon)`
    position: relative;
    top: -10px;
    margin-left: 1em !important;
    display: none !important;

    ${SideBarItemWrapper}:hover & {
        display: inline !important;
    }
`;

const PagesList: FunctionComponent<PagesListProps> = ({ pageId, expandedGroupIds, onGroupCollapse, onGroupExpand }) => {
    const [dragForbidden, setDragForbidden, unsetDragForbidden] = useBoolean();
    const [dragging, setDragging, unsetDragging] = useBoolean();
    const [nameEditedMenuItemId, setNameEditedMenuItemId, stopNameEdit] = useResettableState<string | null>(null);

    const isEditMode = useSelector((state: ReduxState) => state.config.isEditMode || false);
    const pages = useSelector((state: ReduxState) => state.pages);
    const selected = useMemo(() => {
        const pagesMap = createPagesMap(pages);
        const page = pagesMap[pageId];
        const homePageId = pages[0].id;
        return pages && pages.length > 0 ? findSelectedRootPageId(pagesMap, page ? page.id : homePageId) : null;
    }, [pages, pageId]);
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

    useEffect(() => {
        const containingGroup = find(
            pages,
            pageMenuItem => pageMenuItem.type === 'pageGroup' && find(pageMenuItem.pages, { id: pageId })
        ) as PageGroup;
        if (containingGroup && !_.includes(expandedGroupIds, containingGroup.id)) onGroupExpand(containingGroup.id);
    }, [pageId]);

    const dispatch = useDispatch();
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 1 } }));
    const pageCount = pageIds.length;

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
                onGroupCollapse(activePageMenuItem.id);
            }
        },
        [pages, expandedGroupIds]
    );

    function onPageGroupClick(clickedPageGroupId: string) {
        if (includes(expandedGroupIds, clickedPageGroupId)) onGroupCollapse(clickedPageGroupId);
        else onGroupExpand(clickedPageGroupId);
    }

    function onPageSelected(page: PageDefinition) {
        dispatch(selectPage(page.id, page.isDrillDown));
    }

    function onItemRemoved(pageListItem: PageMenuItem) {
        dispatch(removePageMenuItem(pageListItem, pageId));
    }

    function onNameChange(pageMenuItemId: string, newName: string) {
        dispatch(changePageMenuItemName(pageMenuItemId, newName));
        stopNameEdit();
    }

    function onIconChange(pageMenuItemId: string, icon?: SemanticICONS) {
        dispatch(changePageMenuItemIcon(pageMenuItemId, icon || undefined));
    }

    function renderPageMenuItem(pageMenuItem: PageMenuItem, subItem = false): ReactNode[] {
        const itemNameInEdit = nameEditedMenuItemId === pageMenuItem.id;

        const style: CSSProperties = {
            paddingTop: itemNameInEdit ? 3 : undefined,
            paddingBottom: 3,
            paddingRight: 0,
            cursor: dragging ? 'inherit' : undefined
        };

        if (itemNameInEdit) style.paddingLeft = 0;

        const renderedMenuItem = (
            <SortableMenuItem
                id={pageMenuItem.id}
                as={isEditMode ? 'span' : 'a'}
                link
                key={pageMenuItem.id}
                href={`${Consts.CONTEXT_PATH}/page/${pageMenuItem.id}`}
                active={selected === pageMenuItem.id}
                className={`pageMenuItem ${pageMenuItem.id}PageMenuItem`}
                onClick={(event: React.MouseEvent) => {
                    consumeEvent(event);
                    if (pageMenuItem.type === 'page') onPageSelected(pageMenuItem);
                    else onPageGroupClick(pageMenuItem.id);
                }}
                subItem={subItem}
                style={style}
                expandable={pageMenuItem.type === 'pageGroup' && !itemNameInEdit}
                expanded={includes(expandedGroupIds, pageMenuItem.id)}
            >
                {!itemNameInEdit && (
                    <IconSelection
                        style={{
                            position: 'relative',
                            top: -1,
                            verticalAlign: 'top'
                        }}
                        value={pageMenuItem.icon}
                        onChange={icon => onIconChange(pageMenuItem.id, icon)}
                        enabled={isEditMode}
                    />
                )}
                <EditableLabel
                    value={pageMenuItem.name}
                    editing={itemNameInEdit}
                    onCancel={stopNameEdit}
                    onChange={newName => onNameChange(pageMenuItem.id, newName)}
                    style={{
                        color: 'inherit',
                        float: 'none',
                        padding: 0,
                        margin: 0,
                        fontSize: sideBarItemFontSize,
                        fontWeight: 'inherit',
                        ...(!itemNameInEdit && {
                            height: 20,
                            maxWidth: 113,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        })
                    }}
                />
                {isEditMode && !nameEditedMenuItemId && (
                    <>
                        <EditIcon
                            name="edit"
                            size="small"
                            onClick={(event: React.MouseEvent) => {
                                consumeEvent(event);
                                setNameEditedMenuItemId(pageMenuItem.id);
                            }}
                        />
                        {pageCount > 1 && (
                            <RemoveIcon
                                name="remove"
                                size="small"
                                onClick={(event: React.MouseEvent) => {
                                    consumeEvent(event);
                                    onItemRemoved(pageMenuItem);
                                }}
                                isSubItem={subItem}
                            />
                        )}
                    </>
                )}
            </SortableMenuItem>
        );

        if (pageMenuItem.type === 'page' || !includes(expandedGroupIds, pageMenuItem.id)) return [renderedMenuItem];
        return [renderedMenuItem, ...pageMenuItem.pages.map(childItem => renderPageMenuItem(childItem, true))];
    }

    let cursor;
    if (dragForbidden) cursor = 'not-allowed';
    else if (dragging) cursor = 'grabbing';

    const wrapperStyle = {
        flexGrow: 1,
        flexShrink: 1,
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden'
    } as const;

    const pagesContainer = (
        <div className="pages" style={{ cursor, ...wrapperStyle }}>
            {chain(pages)
                .filter(drillDownPagesFilter)
                .map(pageMenuItem => renderPageMenuItem(pageMenuItem, false))
                .flatten()
                .value()}
        </div>
    );

    if (isEditMode) {
        return (
            <div style={wrapperStyle}>
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
                    <AddPageButton />
                    <AddPageGroupButton />
                </div>
            </div>
        );
    }

    return pagesContainer;
};

export default PagesList;
