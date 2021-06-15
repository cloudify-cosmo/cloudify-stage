import _ from 'lodash';

import 'jquery-ui/ui/widgets/sortable';
import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import i18n from 'i18next';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';

import AddPageButton from '../containers/AddPageButton';
import { Confirm, Icon } from './basic';
import Consts from '../utils/consts';
import SortableMenuItem from './SortableMenuItem';

export interface Page {
    id: string;
    name: string;
    isDrillDown: boolean;
    tabs: any[];
    widgets: any[];
}

export interface PagesListProps {
    onPageSelected: (page: Page) => void;
    onPageRemoved: (page: Page) => void;
    onPageReorder: (index: number, newIndex: number) => void;
    pages: Page[];
    selected?: string;
    isEditMode: boolean;
}

export interface PagesListState {
    pageToRemove?: Page | null;
}

export default function PagesList({
    isEditMode,
    onPageRemoved,
    onPageReorder,
    onPageSelected,
    pages,
    selected = ''
}: PagesListProps) {
    const [pageToRemove, setPageToRemove] = useState<Page | null>(null);
    const pageIds = _.filter(pages, p => !p.isDrillDown).map(({ id }) => id);
    const sensors = useSensors(useSensor(PointerSensor));

    let pageCount = 0;
    pages.forEach(page => {
        if (!page.isDrillDown) {
            pageCount += 1;
        }
    });
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
                sensors={isEditMode ? sensors : undefined}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={pageIds} strategy={verticalListSortingStrategy}>
                    {_.filter(pages, p => !p.isDrillDown).map(page => (
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
                                        event.stopPropagation();
                                        if (_.isEmpty(page.tabs) && _.isEmpty(page.widgets)) onPageRemoved(page);
                                        else setPageToRemove(page);
                                    }}
                                />
                            ) : (
                                ''
                            )}
                        </SortableMenuItem>
                    ))}
                </SortableContext>
            </DndContext>
            {isEditMode && (
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                    {/* @ts-ignore until the AddPageButton not fully migrated to ts */}
                    <AddPageButton />
                </div>
            )}
            <Confirm
                open={!!pageToRemove}
                onCancel={() => setPageToRemove(null)}
                onConfirm={() => {
                    if (pageToRemove) {
                        onPageRemoved(pageToRemove);
                        setPageToRemove(null);
                    }
                }}
                header={i18n.t(
                    'editMode.pageRemovalModal.header',
                    `Are you sure you want to remove page {{pageName}}?`,
                    { pageName: _.get(pageToRemove, 'name') }
                )}
                content={i18n.t(
                    'editMode.pageRemovalModal.message',
                    'All widgets and tabs present in this page will be removed as well'
                )}
            />
        </>
    );
}

PagesList.propTypes = {
    onPageSelected: PropTypes.func.isRequired,
    onPageRemoved: PropTypes.func.isRequired,
    onPageReorder: PropTypes.func.isRequired,
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            isDrillDown: PropTypes.bool,
            tabs: PropTypes.arrayOf(PropTypes.shape({})),
            widgets: PropTypes.arrayOf(PropTypes.shape({}))
        })
    ).isRequired,
    selected: PropTypes.string,
    isEditMode: PropTypes.bool.isRequired
};
