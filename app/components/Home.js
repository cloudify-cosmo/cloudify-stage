/**
 * Created by kinneretzin on 29/08/2016.
 */

import React, { Component, PropTypes } from 'react';

import SideBar from '../containers/SideBar';
import Page from '../containers/Page';

export default class Home extends Component {

    componentWillMount() {
        this._handleContext(this.props.selectedPage,this.props.contextParams);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pageId !== this.props.pageId) {
            this._handleContext(nextProps.selectedPage,nextProps.contextParams);
        }
    }

    componentDidUpdate() {
        if (this.props.isMaintenance) {
            this.props.navigateToMaintenancePage();
        }
    }

    _handleContext(selectedPage,contextParams) {
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
        var pageId = this.props.pageId;

        return (
            <div className='main'>
                <SideBar pageId={pageId}/>

                <div className="page">
                    <div className="ui basic segment">
                        <Page pageId={pageId} pageName={this.props.params.pageName}/>
                    </div>
                </div>
            </div>
        );
    }
}

