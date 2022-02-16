import React from 'react';
import type { CSSProperties, FunctionComponent } from 'react';
import { closestCenter, DndContext, DragEndEvent, PointerSensor, SensorDescriptor } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import _, { map } from 'lodash';
import type { IconProps } from 'semantic-ui-react';
import { CSS } from '@dnd-kit/utilities';
import StageUtils from '../../../utils/stageUtils';
import { Divider, Icon, List, Message, Ref, Segment } from '../../basic';
import { PageMenuItem } from '../templates/types';

const t = StageUtils.getT('templates');

interface SortablePageItemProps {
    item: PageMenuItem;
    id: string;
    name: string;
    onRemove: () => void;
}

const SortablePageItem: FunctionComponent<SortablePageItemProps> = ({ item, id, name, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id,
        data: { item }
    });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition !== null ? transition : undefined
    };

    return (
        <Ref innerRef={setNodeRef}>
            <List.Item style={style} {...attributes}>
                {name}
                <span className="right floated actionIcons">
                    <Icon link name="minus" onClick={onRemove} title={t('removePage')} />
                    <Icon {...listeners} link name="move" className="handle" title={t('reorderPage')} />
                </span>
            </List.Item>
        </Ref>
    );
};

interface SortableListProps {
    icon: IconProps['name'];
    items: { item: any; id: string; name: string }[];
    titleI18nKey: string;
    noDataMessageI18nKey: string;
    onUpdate: (items: any[]) => void;
}

const SortableList: FunctionComponent<SortableListProps> = ({
    icon,
    items,
    titleI18nKey,
    noDataMessageI18nKey,
    onUpdate
}) => {
    const sensors: SensorDescriptor<any>[] = [
        {
            sensor: PointerSensor,
            options: {}
        }
    ];

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const newItems = map(items, 'item');

            const oldIndex = newItems.indexOf(active.data.current?.item);
            const newIndex = newItems.indexOf(over.data.current?.item);

            const removed = newItems.splice(oldIndex, 1)[0];
            newItems.splice(newIndex, 0, removed);

            onUpdate(newItems);
        }
    }

    function handleItemRemove(id: string) {
        onUpdate(_(items).reject({ id }).map('item').value());
    }

    return (
        <Segment style={{ width: '50%' }}>
            <Icon name={icon} />
            {t(titleI18nKey)}
            <Divider />
            <List divided relaxed verticalAlign="middle" className="light" id="reorderList">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToParentElement]}
                >
                    <SortableContext items={map(items, 'id')} strategy={verticalListSortingStrategy}>
                        {items.map(({ item, id, name }) => {
                            return (
                                <SortablePageItem
                                    name={name}
                                    item={item}
                                    id={id}
                                    key={id}
                                    onRemove={() => handleItemRemove(id)}
                                />
                            );
                        })}
                    </SortableContext>
                </DndContext>

                {_.isEmpty(items) && <Message content={t(noDataMessageI18nKey)} />}
            </List>
        </Segment>
    );
};

export default SortableList;
