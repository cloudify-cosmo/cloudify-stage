/**
 * Created by kinneretzin on 29/08/2016.
 */

import React, { Component, PropTypes } from 'react';

import SideBar from '../containers/SideBar';
import Page from '../containers/Page';
import MaintenanceModePageMessage from './maintenance/MaintenanceModePageMessage';

export default class Home extends Component {

    componentWillMount() {
        this._handleContext(this.props.selectedPage,this.props.contextParams);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.pageId !== this.props.pageId) {
            this._handleContext(nextProps.selectedPage,nextProps.contextParams);
        }
    }

    _handleContext(selectedPage,contextParams) {
        if (!selectedPage) {
            this.props.navigateTo404();
            return;
        }
        if (!selectedPage.isDrillDown) {
            this.props.onClearContext();
        }

        _.each(contextParams,(value,key)=>{
            this.props.onSetContextValue(key,value);
        });
    }

    render() {
        var pageId = this.props.params.pageId || "0";

        if (this.props.isMaintenance) {
            return <MaintenanceModePageMessage/>
        }
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

