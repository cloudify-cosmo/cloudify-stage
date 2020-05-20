/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';

import WidgetsList from '../containers/WidgetsList';
import Breadcrumbs from './Breadcrumbs';
import EditModeBubble from './EditModeBubble';
import { EditableLabel } from './basic';

export default class Page extends Component {
    static propTypes = {
        page: PropTypes.object.isRequired,
        pagesList: PropTypes.array.isRequired,
        onPageNameChange: PropTypes.func.isRequired,
        onPageDescriptionChange: PropTypes.func.isRequired,
        onWidgetsGridDataChange: PropTypes.func.isRequired,
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
            onWidgetsGridDataChange,
            page,
            pagesList
        } = this.props;
        const maximizeWidget = _.findIndex(page.widgets, { maximized: true }) >= 0;

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

                <WidgetsList
                    widgets={page.widgets}
                    pageId={page.id}
                    onWidgetsGridDataChange={onWidgetsGridDataChange}
                    isEditMode={isEditMode || false}
                />

                <EditModeBubble isVisible={isEditMode} onDismiss={onEditModeExit} page={page} />
            </div>
        );
    }
}
