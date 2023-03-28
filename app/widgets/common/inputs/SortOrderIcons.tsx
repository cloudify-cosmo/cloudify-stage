import React from 'react';
import { map } from 'lodash';
import styled from 'styled-components';
import type { HTMLProps } from 'react';
import type { StrictIconProps } from 'semantic-ui-react';
import { Dropdown } from '../../../components/basic';
import StageUtils from '../../../utils/stageUtils';
import translateInputs from './utils/translateInputs';
import DefaultSortIcon from './DefaultSortIcon';

const translate = StageUtils.composeT(translateInputs, 'buttons.sortOrder');

const DropdownContainer = styled.div`
    .ui.dropdown > i {
        margin-right: 0;
    }
    .ui.dropdown > .dropdown.icon {
        margin-left: 0;
    }
`;

export type SortOrder = 'original' | 'ascending' | 'descending';

type SortOrderIconProps = Pick<StrictIconProps, 'name'> & Pick<HTMLProps<HTMLElement>, 'title'>;

export interface SortOrderIconsProps {
    selected: SortOrder;
    onChange: (sortOrder: SortOrder) => void;
}

interface SortIconProps extends SortOrderIconsProps {
    sortOrder: SortOrder;
    iconProps: SortOrderIconProps;
}

const SortIcon = ({ sortOrder, selected, onChange, iconProps }: SortIconProps) => {
    if (sortOrder === 'original') return <DefaultSortIcon height={17} />;
    const className = sortOrder === 'ascending' ? 'dds__icon--sort-az' : 'dds__icon--sort-za';
    return (
        <span
            key={sortOrder}
            className={`icon-button dds__icon ${className}`}
            color={selected === sortOrder ? 'blue' : undefined}
            onClick={() => onChange(sortOrder)}
            style={{ fontSize: 14, marginLeft: 8 }}
            {...iconProps}
        />
    );
};

export default function SortOrderIcons({ onChange, selected }: SortOrderIconsProps) {
    const sortOrderToIconPropsMap: Record<SortOrder, SortOrderIconProps> = {
        original: { title: translate('original'), name: 'sort' },
        ascending: { title: translate('ascending'), name: 'sort alphabet down' },
        descending: { title: translate('descending'), name: 'sort alphabet up' }
    };

    return (
        <DropdownContainer>
            <Dropdown trigger={<DefaultSortIcon height={13} />} className="icon-button">
                <Dropdown.Menu direction="left">
                    <Dropdown.Header>
                        {map(sortOrderToIconPropsMap, (iconProps: SortOrderIconProps, sortOrder: SortOrder) => (
                            <SortIcon
                                sortOrder={sortOrder}
                                selected={selected}
                                onChange={onChange}
                                iconProps={iconProps}
                            />
                        ))}
                    </Dropdown.Header>
                </Dropdown.Menu>
            </Dropdown>
        </DropdownContainer>
    );
}
