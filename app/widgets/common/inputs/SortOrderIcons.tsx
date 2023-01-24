import React from 'react';
import { map } from 'lodash';
import styled from 'styled-components';
import type { HTMLProps } from 'react';
import type { StrictIconProps } from 'semantic-ui-react';
import { Icon, Dropdown } from '../../../components/basic';
import StageUtils from '../../../utils/stageUtils';
import translateInputs from './utils/translateInputs';

const translate = StageUtils.composeT(translateInputs, 'buttons.sortOrder');

const DropdownContainer = styled.div`
    float: right;
    //margin-right: 10px;
    //margin-top: 7px;
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

export default function SortOrderIcons({ onChange, selected }: SortOrderIconsProps) {
    const sortOrderToIconPropsMap: Record<SortOrder, SortOrderIconProps> = {
        original: { title: translate('original'), name: 'sort' },
        ascending: { title: translate('ascending'), name: 'sort alphabet down' },
        descending: { title: translate('descending'), name: 'sort alphabet up' }
    };

    return (
        <DropdownContainer>
            <Dropdown
                trigger={
                    <Icon
                        color="blue"
                        name={sortOrderToIconPropsMap[selected].name}
                        size="large"
                        aria-label={translate('dropdownLabel')}
                    />
                }
            >
                <Dropdown.Menu>
                    <Dropdown.Header>
                        {map(sortOrderToIconPropsMap, (iconProps: SortOrderIconProps, sortOrder: SortOrder) => (
                            <Icon
                                key={sortOrder}
                                link
                                size="big"
                                color={selected === sortOrder ? 'blue' : undefined}
                                onClick={() => onChange(sortOrder)}
                                {...iconProps}
                            />
                        ))}
                    </Dropdown.Header>
                </Dropdown.Menu>
            </Dropdown>
        </DropdownContainer>
    );
}
