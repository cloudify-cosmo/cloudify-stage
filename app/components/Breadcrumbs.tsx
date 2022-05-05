import i18n from 'i18next';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import type { PageDefinition } from '../actions/page';
import type { ReduxState } from '../reducers';

import { Label, Breadcrumb, EditableLabel } from './basic';
import type { PageDefinitionWithContext } from './Page';

const BreadCrumbsWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const StyledLabel = styled(Label)`
    && {
        margin-right: 8px;
    }
`;

type GetBreadcrumbPages = (
    pageList: PageDefinitionWithContext[]
) => [editablePage: PageDefinitionWithContext | undefined, historyPageList: PageDefinitionWithContext[]];

const getBreadcrumbPages: GetBreadcrumbPages = pageList => {
    const pageListCopy = [...pageList];
    const editablePage = pageListCopy.pop();
    return [editablePage, pageListCopy];
};

interface BreadcrumbsProps {
    isEditMode: boolean;
    pagesList: PageDefinitionWithContext[];
    onPageNameChange: (page: PageDefinition, newName: string) => void;
    onPageSelected: (page: PageDefinitionWithContext, pagesList: PageDefinitionWithContext[], index: number) => void;
}

export default function Breadcrumbs({ isEditMode, onPageNameChange, onPageSelected, pagesList }: BreadcrumbsProps) {
    const tenantName = useSelector((state: ReduxState) => state.manager.tenants.selected);
    const [editablePage, historyPageList] = getBreadcrumbPages(pagesList);

    return (
        <BreadCrumbsWrapper>
            <StyledLabel color="black">{tenantName}</StyledLabel>
            <Breadcrumb>
                {historyPageList.map((page, pageIndex) => (
                    <React.Fragment key={page.id}>
                        <Breadcrumb.Section link onClick={() => onPageSelected(page, pagesList, pageIndex)}>
                            {page.name}
                        </Breadcrumb.Section>
                        <Breadcrumb.Divider key={`d_${page.id}`} icon="right angle" />
                    </React.Fragment>
                ))}
                {editablePage && (
                    <EditableLabel
                        key={editablePage.id}
                        value={editablePage.name}
                        placeholder={i18n.t('editMode.pageName', 'You must fill a page name')}
                        className="section active pageTitle"
                        enabled={isEditMode}
                        onChange={newName => onPageNameChange(editablePage, newName)}
                        inputSize="mini"
                    />
                )}
            </Breadcrumb>
        </BreadCrumbsWrapper>
    );
}
