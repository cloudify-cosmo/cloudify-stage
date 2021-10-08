import React, { CSSProperties } from 'react';
import type { MenuItemProps } from 'semantic-ui-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from 'styled-components';
import colors from 'cloudify-ui-common/styles/_colors.scss';

import { Menu } from './basic';

const ItemContainer = styled.div`
    position: relative;
    &:before {
        background-color: ${colors.greyNormal};
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
    }

    .item:before {
        background-color: ${colors.greyNormal};
    }
    .item.link:hover {
        text-decoration: none !important; // override semantic ui styles
    }

    .icon.edit {
        display: none;
    }

    :hover .icon.edit {
        display: inline;
    }
`;

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
        <ItemContainer ref={setNodeRef} {...attributes} {...listeners}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Menu.Item {...rest} style={Object.assign(builtInStyle, style)} />
        </ItemContainer>
    );
}
