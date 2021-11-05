import type { FunctionComponent } from 'react';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { chain, find, includes, map, without } from 'lodash';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { SemanticICONS } from 'semantic-ui-react';
import { EditableLabel, Icon } from '../basic';
import AddPageButton from './AddPageButton';
import AddPageGroupButton from './AddPageGroupButton';
import SortableMenuItem, { ItemContainer } from './SortableMenuItem';

import type { PageDefinition } from '../../actions/page';
import type { PageMenuItem } from '../../actions/pageMenu';
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
import { ReduxState } from '../../reducers';
import IconSelection from '../IconSelection';

export interface PagesListProps {
    isEditMode?: boolean;
    pageId: string;
}

function drillDownPagesFilter(pageMenuItem: PageMenuItem) {
    return pageMenuItem.type === 'pageGroup' || !pageMenuItem.isDrillDown;
}

function consumeEvent(event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
}

const RemoveIcon = styled(Icon)`
    position: relative;
    top: 3px;
    right: 3px;
    visibility: hidden;
    float: right;

    ${ItemContainer}:hover & {
        visibility: visible;
    }
`;

const EditIcon = styled(Icon)`
    position: relative;
    top: -3px;
    margin-left: 1em !important;
    display: none !important;

    ${ItemContainer}:hover & {
        display: inline !important;
    }
`;

const PagesList: FunctionComponent<PagesListProps> = ({ isEditMode = false, pageId }) => {
    const [expandedGroupIds, setExpandedGroupIds] = useState<string[]>([]);
    const [dragForbidden, setDragForbidden, unsetDragForbidden] = useBoolean();
    const [dragging, setDragging, unsetDragging] = useBoolean();
    const [nameEditedMenuItemId, setNameEditedMenuItemId, stopNameEdit] = useResettableState<string | null>(null);

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

        function calculateLeftPadding() {
            if (subItem && !itemNameInEdit) return 25;
            if (itemNameInEdit) return 0;
            return undefined;
        }

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
                style={{
                    height: 37,
                    paddingTop: itemNameInEdit ? 3 : undefined,
                    paddingLeft: calculateLeftPadding(),
                    paddingBottom: 3,
                    paddingRight: 0,
                    cursor: dragging ? 'inherit' : undefined
                }}
            >
                {!itemNameInEdit && (
                    <IconSelection
                        style={{
                            position: 'relative',
                            top: -3
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
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        ...(!itemNameInEdit && {
                            height: 13,
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
                            />
                        )}
                    </>
                )}
                {pageMenuItem.type === 'pageGroup' && !itemNameInEdit && (
                    <Icon
                        name="dropdown"
                        rotated={includes(expandedGroupIds, pageMenuItem.id) ? undefined : 'counterclockwise'}
                        style={{ position: 'absolute', right: 12, margin: 0 }}
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
                    <AddPageButton />
                    <AddPageGroupButton />
                </div>
            </>
        );
    }

    return pagesContainer;
};

export default PagesList;
