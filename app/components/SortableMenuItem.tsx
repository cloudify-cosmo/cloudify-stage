import React from 'react';
import type { MenuItemProps } from 'semantic-ui-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Menu } from './basic';

export default function SortableMenuItem({ id, ...rest }: MenuItemProps) {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <div ref={setNodeRef} {...attributes} {...listeners}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Menu.Item {...rest} style={style} />
        </div>
    );
}
