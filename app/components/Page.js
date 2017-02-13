/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import AddWidget from '../containers/AddWidget';
import WidgetsList from './WidgetsList';
import Breadcrumbs from './Breadcrumbs';
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
        isEditMode: PropTypes.bool.isRequired
        };

    render() {
        var maximizeWidget = _.findIndex(this.props.page.widgets, { 'maximized': true }) >= 0;

        $('body').css({overflow: maximizeWidget?'hidden':'inherit'}).scrollTop(0);

        return (
            <div className={`${maximizeWidget?'maximizeWidget':''}`}>
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
                {
                    this.props.isEditMode ?
                    <AddWidget pageId={this.props.page.id}/>
                    :
                    ''
                 }

                <div className='ui divider'/>

                <WidgetsList widgets={this.props.page.widgets} pageId={this.props.page.id}
                             onWidgetsGridDataChange={this.props.onWidgetsGridDataChange}
                             isEditMode={this.props.isEditMode || false}
                             />

                {/* Modal is here so it will exist one time in the page. we dont need it for each edit button*/}
            </div>
        );

    }
}
