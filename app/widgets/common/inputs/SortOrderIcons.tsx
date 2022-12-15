import React from 'react';
import { map } from 'lodash';
import type { SemanticICONS } from 'semantic-ui-react';
import styled from 'styled-components';
import { Icon } from '../../../components/basic';

export type SortOrder = 'original' | 'ascending' | 'descending';

const sortOrderToIconMap: Record<SortOrder, SemanticICONS> = {
    original: 'sort',
    ascending: 'sort alphabet down',
    descending: 'sort alphabet up'
};

const IconsContainer = styled.div`
    float: right;
    margin-right: 10px;
    margin-top: 7px;
`;

export interface SortOrderIconsProps {
    selected: SortOrder;
    onChange: (sortOrder: SortOrder) => void;
}

export default function SortOrderIcons({ onChange, selected }: SortOrderIconsProps) {
    return (
        <IconsContainer>
            {map(sortOrderToIconMap, (icon, method: SortOrder) => (
                <Icon
                    link
                    size="large"
                    name={icon}
                    color={selected === method ? 'blue' : undefined}
                    onClick={() => onChange(method)}
                />
            ))}
        </IconsContainer>
    );
}
