import React, { CSSProperties } from 'react';
import type { MenuItemProps } from 'semantic-ui-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SideBarItem from './SideBarItem';

export default function SortableMenuItem({ id, style, ...rest }: MenuItemProps) {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id
    });
    const builtInStyle: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition !== null ? transition : undefined
    };

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <div ref={setNodeRef} {...attributes} {...listeners}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <SideBarItem {...rest} style={Object.assign(builtInStyle, style)} />
        </div>
    );
}
