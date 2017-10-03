/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import AddPageButton from '../containers/AddPageButton';
import AddWidget from '../containers/AddWidget';
import WidgetsList from './WidgetsList';
import Breadcrumbs from './Breadcrumbs';
import EditModeBubble from './EditModeBubble';
import {EditableLabel} from './basic';

export default class Page extends Component {
    static propTypes = {
        page: PropTypes.object.isRequired,
        pagesList: PropTypes.array.isRequired,
        onPageNameChange: PropTypes.func.isRequired,
        onPageDescriptionChange: PropTypes.func.isRequired,
        onWidgetsGridDataChange: PropTypes.func.isRequired,
        onPageSelected: PropTypes.func.isRequired,
        onPageRemoved: PropTypes.func.isRequired,
        onEditModeExit: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired
        };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.page, nextProps.page)
            || this.props.isEditMode !== nextProps.isEditMode;
    }

    render() {
        var maximizeWidget = _.findIndex(this.props.page.widgets, { 'maximized': true }) >= 0;

        $('body').css({overflow: maximizeWidget?'hidden':'inherit'}).scrollTop(0);

        return (
            <div className={`fullHeight ${maximizeWidget?'maximizeWidget':''}`}>
                <Breadcrumbs pagesList={this.props.pagesList} onPageNameChange={this.props.onPageNameChange} isEditMode={this.props.isEditMode} onPageSelected={this.props.onPageSelected} onPageRemoved={this.props.onPageRemoved}/>

                <div>
                    <EditableLabel
                       text={this.props.page.description}
                       placeholder='Page description'
                       className='pageDescription'
                       isEditEnable={this.props.isEditMode}
                       onEditDone={(newDesc)=>this.props.onPageDescriptionChange(this.props.page.id,newDesc)}
                    />
                </div>

                <div className='ui divider'/>

                <WidgetsList widgets={this.props.page.widgets} pageId={this.props.page.id}
                             onWidgetsGridDataChange={this.props.onWidgetsGridDataChange}
                             isEditMode={this.props.isEditMode || false}
                             />

                <EditModeBubble isVisible={this.props.isEditMode} onDismiss={this.props.onEditModeExit} page={this.props.page}/>

            </div>
        );

    }
}
