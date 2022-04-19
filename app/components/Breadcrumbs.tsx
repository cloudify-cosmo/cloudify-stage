// @ts-nocheck File not migrated fully to TS
import i18n from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { Label, Breadcrumb, EditableLabel } from './basic';

const BreadCrumbsWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const StyledLabel = styled(Label)`
    && {
        margin-right: 8px;
    }
`;

export default function Breadcrumbs({ isEditMode, onPageNameChange, onPageSelected, pagesList }) {
    const breadcrumbElements = [];
    // TODO(RD-1982): use the regular, unreversed list
    const reversedPagesList = _([...pagesList])
        .reverse()
        .value();
    _.each(reversedPagesList, (page, index) => {
        if (index !== reversedPagesList.length - 1) {
            breadcrumbElements.push(
                <Breadcrumb.Section link key={page.id} onClick={() => onPageSelected(page, reversedPagesList, index)}>
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

    return (
        <BreadCrumbsWrapper>
            <StyledLabel color="black">Andrew</StyledLabel>
            <Breadcrumb>{breadcrumbElements}</Breadcrumb>
        </BreadCrumbsWrapper>
    );
}

Breadcrumbs.propTypes = {
    isEditMode: PropTypes.bool.isRequired,
    onPageNameChange: PropTypes.func.isRequired,
    onPageSelected: PropTypes.func.isRequired,
    pagesList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired
};
