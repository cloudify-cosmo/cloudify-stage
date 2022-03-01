import React, { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SideBarItem from './SideBarItem';
import type { SideBarItemProps } from './SideBarItem';

export default function SortableMenuItem({ id, style, className, ...rest }: SideBarItemProps) {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id
    });
    const builtInStyle: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition !== null ? transition : undefined
    };

    return (
        <div ref={setNodeRef} {...attributes} {...listeners}>
            <SideBarItem {...rest} className={`item ${className}`} style={Object.assign(builtInStyle, style)} />
        </div>
    );
}
