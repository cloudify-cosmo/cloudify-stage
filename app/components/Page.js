/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import Breadcrumbs from './Breadcrumbs';
import EditModeBubble from './EditModeBubble';
import { Button, EditableLabel } from './basic';
import PageContent from './PageContent';
import AddWidget from '../containers/AddWidget';
import AddPageButton from '../containers/AddPageButton';

export default class Page extends Component {
    static propTypes = {
        page: PropTypes.object.isRequired,
        pagesList: PropTypes.array.isRequired,
        onPageNameChange: PropTypes.func.isRequired,
        onPageDescriptionChange: PropTypes.func.isRequired,
        onWidgetUpdated: PropTypes.func.isRequired,
        onWidgetRemoved: PropTypes.func.isRequired,
        onWidgetAdded: PropTypes.func.isRequired,
        onPageSelected: PropTypes.func.isRequired,
        onEditModeExit: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired
    };

    shouldComponentUpdate(nextProps, nextState) {
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
            page,
            pagesList
        } = this.props;
        const maximizeWidget =
            _.find(page.widgets, { maximized: true }) ||
            _(page.tabs)
                .flatMap('widgets')
                .find({ maximized: true });

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
                    isEditMode={isEditMode || false}
                />
                {isEditMode && (
                    <EditModeBubble onDismiss={onEditModeExit} header="Edit mode">
                        <AddWidget onWidgetAdded={onWidgetAdded} />
                        <AddPageButton />
                        <Button basic content="Exit" icon="sign out" onClick={onEditModeExit} />
                    </EditModeBubble>
                )}
            </div>
        );
    }
}
