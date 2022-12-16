import React from 'react';
import { map } from 'lodash';
import styled from 'styled-components';
import type { HTMLProps } from 'react';
import type { StrictIconProps } from 'semantic-ui-react';
import { Icon } from '../../../components/basic';
import StageUtils from '../../../utils/stageUtils';
import translateInputs from './utils/tranlateInputs';

const translate = StageUtils.composeT(translateInputs, 'buttons.sortOrder');

const IconsContainer = styled.div`
    float: right;
    margin-right: 10px;
    margin-top: 7px;
`;

export type SortOrder = 'original' | 'ascending' | 'descending';

type SortOrderIconProps = Pick<StrictIconProps, 'name'> & Pick<HTMLProps<HTMLElement>, 'title'>;

export interface SortOrderIconsProps {
    selected: SortOrder;
    onChange: (sortOrder: SortOrder) => void;
}

export default function SortOrderIcons({ onChange, selected }: SortOrderIconsProps) {
    const sortOrderToIconMap: Record<SortOrder, SortOrderIconProps> = {
        original: { title: translate('original'), name: 'sort' },
        ascending: { title: translate('ascending'), name: 'sort alphabet down' },
        descending: { title: translate('descending'), name: 'sort alphabet up' }
    };

    return (
        <IconsContainer>
            {map(sortOrderToIconMap, (iconProps: SortOrderIconProps, sortOrder: SortOrder) => (
                <Icon
                    key={sortOrder}
                    link
                    size="large"
                    color={selected === sortOrder ? 'blue' : undefined}
                    onClick={() => onChange(sortOrder)}
                    {...iconProps}
                />
            ))}
        </IconsContainer>
    );
}
