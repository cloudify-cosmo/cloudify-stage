import React, { useCallback } from 'react';
import type { FunctionComponent } from 'react';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import AddPageButton from '../containers/AddPageButton';
import { Icon } from './basic';
import Consts from '../utils/consts';

import SortableMenuItem from './SortableMenuItem';

import type { PageDefinition } from '../actions/page';

export interface PagesListProps {
    onPageSelected: (page: PageDefinition) => void;
    onPageRemoved: (page: PageDefinition) => void;
    onPageReorder: (index: number, newIndex: number) => void;
    pages: PageDefinition[];
    selected?: string;
    isEditMode: boolean;
}

export interface PagesListState {
    pageToRemove?: PageDefinition | null;
}

const PagesList: FunctionComponent<PagesListProps> = ({
    isEditMode,
    onPageRemoved,
    onPageReorder,
    onPageSelected,
    pages,
    selected = ''
}) => {
    const pageIds = pages.filter(p => !p.isDrillDown).map(({ id }) => id);
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

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={isEditMode ? handleDragEnd : undefined}
            >
                <SortableContext items={isEditMode ? pageIds : []} strategy={verticalListSortingStrategy}>
                    <div className="pages">
                        {pages
                            .filter(p => !p.isDrillDown)
                            .map(page => (
                                <SortableMenuItem
                                    id={page.id}
                                    as="a"
                                    link
                                    key={page.id}
                                    href={`${Consts.CONTEXT_PATH}/page/${page.id}`}
                                    active={selected === page.id}
                                    className={`pageMenuItem ${page.id}PageMenuItem`}
                                    onClick={event => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        onPageSelected(page);
                                    }}
                                >
                                    {page.name}
                                    {isEditMode && pageCount > 1 ? (
                                        <Icon
                                            name="remove"
                                            size="small"
                                            className="pageRemoveButton"
                                            onClick={(event: MouseEvent) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                onPageRemoved(page);
                                            }}
                                        />
                                    ) : (
                                        ''
                                    )}
                                </SortableMenuItem>
                            ))}
                    </div>
                </SortableContext>
            </DndContext>
            {isEditMode && (
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                    {/* @ts-ignore until the AddPageButton not fully migrated to ts */}
                    <AddPageButton />
                </div>
            )}
        </>
    );
};

export default PagesList;
