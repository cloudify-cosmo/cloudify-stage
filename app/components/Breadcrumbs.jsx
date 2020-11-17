/**
 * Created by kinneretzin on 18/09/2016.
 */
import i18n from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import { Breadcrumb, EditableLabel } from './basic';

export default function Breadcrumbs({ isEditMode, onPageNameChange, onPageSelected, pagesList }) {
    const breadcrumbElements = [];
    const reversedPagesList = _([...pagesList])
        .reverse()
        .value();
    _.each(reversedPagesList, (p, index) => {
        if (index !== reversedPagesList.length - 1) {
            breadcrumbElements.push(
                <Breadcrumb.Section link key={p.id} onClick={() => onPageSelected(p, reversedPagesList, index)}>
                    {p.name}
                </Breadcrumb.Section>
            );
            breadcrumbElements.push(<Breadcrumb.Divider key={`d_${p.id}`} icon="right angle" />);
        } else {
            breadcrumbElements.push(
                <EditableLabel
                    key={p.id}
                    value={p.name}
                    placeholder={i18n.t('editMode.pageName', 'You must fill a page name')}
                    className="section active pageTitle"
                    enabled={isEditMode}
                    onChange={newName => onPageNameChange(p, newName)}
                    inputSize="mini"
                />
            );
        }
    });
    return <Breadcrumb className="breadcrumbLineHeight">{breadcrumbElements}</Breadcrumb>;
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
