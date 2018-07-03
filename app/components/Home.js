/**
 * Created by kinneretzin on 29/08/2016.
 */

import React, { Component } from 'react';

import SideBar from '../containers/SideBar';
import Page from '../containers/Page';
import ToursButton from '../containers/ToursButton';

export default class Home extends Component {

    constructor(props,context){
        super(props, context);
    }

    componentWillMount() {
        this._handleContext(this.props.selectedPage, this.props.contextParams, this.props.emptyPages);
        this.props.onStorePageId(this.props.pageId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pageId !== this.props.pageId) {
            this.props.onStorePageId(nextProps.pageId);
            this._handleContext(nextProps.selectedPage, nextProps.contextParams, nextProps.emptyPages);
        }
    }

    componentDidUpdate() {
        if (this.props.isMaintenance) {
            this.props.navigateToMaintenancePage();
        }
    }

    _handleContext(selectedPage, contextParams, emptyPages) {
        if (emptyPages) {
            this.props.navigateToError('No pages available to display. Please try to reset application to the default settings.');
            return;
        }
        if (!selectedPage) {
            this.props.navigateTo404();
            return;
        }
        // Always clear the context. Whatever is relevant to the drilldown should be passed as drilldown context
        this.props.onClearContext();
        
        // Go over all the drilldown context and set it all (from top down)
        _.each(contextParams,cp=>{
            _.each(cp.context,(value,key)=>{
                this.props.onSetContextValue(key,value);
            });
        });

        this.props.onSetDrilldownContext(contextParams);

    }

    render() {
        if (this.props.emptyPages) {
            return null;
        }

        var pageId = this.props.pageId;
        var pageName = this.props.pageName;

        return (
            <div className='main'>

                <ToursButton />

                <SideBar pageId={pageId}/>

                <div className="page">
                    <div className="ui basic segment">
                        <Page pageId={pageId} pageName={pageName}/>
                    </div>
                </div>
            </div>
        );
    }
}

