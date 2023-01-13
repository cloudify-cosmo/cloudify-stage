import i18n from 'i18next';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import type { PageDefinition } from '../actions/page';
import type { ReduxState } from '../reducers';

import { Label, Breadcrumb, EditableLabel } from './basic';
import { TextEllipsis } from './shared';

import type { PageDefinitionWithContext } from './routes/PageContainer';

const BreadCrumbsWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 17px;
`;

const StyledLabel = styled(Label)`
    && {
        margin-right: 8px;
    }
`;

const StyledEditableLabel = styled(EditableLabel)`
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 450px;
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
                            <TextEllipsis maxWidth="300px">{page.name}</TextEllipsis>
                        </Breadcrumb.Section>
                        <Breadcrumb.Divider key={`d_${page.id}`} />
                    </React.Fragment>
                ))}
                {editablePage && (
                    <StyledEditableLabel
                        key={editablePage.id}
                        value={editablePage.name}
                        placeholder={i18n.t('editMode.pageName')}
                        className="section active pageTitle"
                        enabled={isEditMode}
                        onChange={(newName: string) => onPageNameChange(editablePage, newName)}
                        inputSize="mini"
                    />
                )}
            </Breadcrumb>
        </BreadCrumbsWrapper>
    );
}
