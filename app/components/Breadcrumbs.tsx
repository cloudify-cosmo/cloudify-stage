import i18n from 'i18next';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { isEqual } from 'lodash';
import type { PageDefinition } from '../actions/page';
import type { ReduxState } from '../reducers';

import { Label, Breadcrumb, EditableLabel } from './basic';
import { PageDefinitionWithContext } from './Page';
import { deploymentsPageListSnapshot } from './Breadcrumbs.const';

const BreadCrumbsWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const StyledLabel = styled(Label)`
    && {
        margin-right: 8px;
    }
`;

interface BreadcrumbsProps {
    isEditMode: boolean;
    pagesList: PageDefinitionWithContext[];
    onPageNameChange: (page: PageDefinition, newName: string) => void;
    onPageSelected: (page: PageDefinitionWithContext, pagesList: PageDefinitionWithContext[], index: number) => void;
}

export default function Breadcrumbs({ isEditMode, onPageNameChange, onPageSelected, pagesList }: BreadcrumbsProps) {
    const tenantName = useSelector((state: ReduxState) => state.manager.tenants.selected);
    const breadcrumbElements: ReactElement[] = [];

    // TODO(RD-1982): use the regular, unreversed list
    const reversedPagesList = [...pagesList].reverse();

    reversedPagesList.forEach((page, pageIndex) => {
        if (pageIndex !== reversedPagesList.length - 1) {
            breadcrumbElements.push(
                <Breadcrumb.Section
                    link
                    key={page.id}
                    onClick={() => onPageSelected(page, reversedPagesList, pageIndex)}
                >
                    {page.name}
                </Breadcrumb.Section>
            );
            breadcrumbElements.push(<Breadcrumb.Divider key={`d_${page.id}`} icon="right angle" />);
        } else {
            breadcrumbElements.push(
                <EditableLabel
                    key={page.id}
                    value={page.name}
                    placeholder={i18n.t('editMode.pageName', 'You must fill a page name')}
                    className="section active pageTitle"
                    enabled={isEditMode}
                    onChange={newName => onPageNameChange(page, newName)}
                    inputSize="mini"
                />
            );
        }
    });

    // eslint-disable-next-line
    console.log('='.repeat(35));
    // eslint-disable-next-line
    console.log(isEqual(deploymentsPageListSnapshot, reversedPagesList));

    return (
        <BreadCrumbsWrapper>
            <StyledLabel color="black">{tenantName}</StyledLabel>
            <Breadcrumb>{breadcrumbElements}</Breadcrumb>
        </BreadCrumbsWrapper>
    );
}
