import i18n from 'i18next';
import _ from 'lodash';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import type { PageDefinition } from '../actions/page';
import type { ReduxState } from '../reducers';

import { Label, Breadcrumb, EditableLabel } from './basic';
import { PageDefinitionWithContext } from './Page';

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

    // TODO(RD-1982): use the regular, unreversed list
    const reversedPagesList = _([...pagesList])
        .reverse()
        .value();

    const lastReversedPage = reversedPagesList.pop();

    const breadcrumbElements: ReactElement[] = reversedPagesList.map((page, index) => (<>
        <Breadcrumb.Section link key={page.id} onClick={() => onPageSelected(page, reversedPagesList, index)}>
            {page.name}
        </Breadcrumb.Section>
        <Breadcrumb.Divider key={`d_${page.id}`} icon="right angle" />
    </>));

    if(lastReversedPage) {
        breadcrumbElements.push(
            <EditableLabel
                key={lastReversedPage.id}
                value={lastReversedPage.name}
                placeholder={i18n.t('editMode.pageName', 'You must fill a page name')}
                className="section active pageTitle"
                enabled={isEditMode}
                onChange={newName => onPageNameChange(lastReversedPage, newName)}
                inputSize="mini"
            />
        );
    }

    return (
        <BreadCrumbsWrapper>
            <StyledLabel color="black">{tenantName}</StyledLabel>
            <Breadcrumb>
                {breadcrumbElements}
            </Breadcrumb>
        </BreadCrumbsWrapper>
    );
}
