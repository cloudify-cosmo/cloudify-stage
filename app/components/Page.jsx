/**
 * Created by kinneretzin on 29/08/2016.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Breadcrumbs from './Breadcrumbs';
import EditModeBubble from './EditModeBubble';
import { Button, EditableLabel } from './basic';
import PageContent from './PageContent';

export default class Page extends Component {
    shouldComponentUpdate(nextProps) {
        const { isEditMode, page } = this.props;
        return !_.isEqual(page, nextProps.page) || isEditMode !== nextProps.isEditMode;
    }

    render() {
        const {
            isEditMode,
            onEditModeExit,
            onPageDescriptionChange,
            onPageNameChange,
            onPageSelected,
            onWidgetAdded,
            onWidgetUpdated,
            onWidgetRemoved,
            onTabAdded,
            onTabRemoved,
            onTabUpdated,
            onTabMoved,
            onLayoutSectionAdded,
            onLayoutSectionRemoved,
            page,
            pagesList
        } = this.props;
        const maximizeWidget =
            _(page.layout).flatMap('content').find({ maximized: true }) ||
            _(page.layout).flatMap('content').flatMap('widgets').find({ maximized: true });

        $('body')
            .css({ overflow: maximizeWidget ? 'hidden' : 'inherit' })
            .scrollTop(0);

        return (
            <div className={`fullHeight ${maximizeWidget ? 'maximizeWidget' : ''}`}>
                <Breadcrumbs
                    pagesList={pagesList}
                    onPageNameChange={onPageNameChange}
                    isEditMode={isEditMode}
                    onPageSelected={onPageSelected}
                />
                <div>
                    <EditableLabel
                        value={page.description}
                        placeholder="Page description"
                        className="pageDescription"
                        enabled={isEditMode}
                        onChange={newDesc => onPageDescriptionChange(page.id, newDesc)}
                        inputSize="mini"
                    />
                </div>
                <div className="ui divider" />
                <PageContent
                    page={page}
                    onWidgetUpdated={onWidgetUpdated}
                    onWidgetRemoved={onWidgetRemoved}
                    onWidgetAdded={onWidgetAdded}
                    onTabAdded={onTabAdded}
                    onTabRemoved={onTabRemoved}
                    onTabUpdated={onTabUpdated}
                    onTabMoved={onTabMoved}
                    onLayoutSectionAdded={onLayoutSectionAdded}
                    onLayoutSectionRemoved={onLayoutSectionRemoved}
                    isEditMode={isEditMode || false}
                />
                {isEditMode && (
                    <EditModeBubble onDismiss={onEditModeExit} header="Edit mode">
                        <Button basic content="Exit" icon="sign out" onClick={onEditModeExit} />
                    </EditModeBubble>
                )}
            </div>
        );
    }
}

Page.propTypes = {
    page: PropTypes.shape({
        id: PropTypes.string,
        description: PropTypes.string,
        layout: PropTypes.arrayOf(PropTypes.shape({}))
    }).isRequired,
    pagesList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onPageNameChange: PropTypes.func.isRequired,
    onPageDescriptionChange: PropTypes.func.isRequired,
    onWidgetUpdated: PropTypes.func.isRequired,
    onWidgetRemoved: PropTypes.func.isRequired,
    onWidgetAdded: PropTypes.func.isRequired,
    onTabAdded: PropTypes.func.isRequired,
    onTabRemoved: PropTypes.func.isRequired,
    onTabUpdated: PropTypes.func.isRequired,
    onTabMoved: PropTypes.func.isRequired,
    onPageSelected: PropTypes.func.isRequired,
    onEditModeExit: PropTypes.func.isRequired,
    onLayoutSectionRemoved: PropTypes.func.isRequired,
    onLayoutSectionAdded: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired
};
