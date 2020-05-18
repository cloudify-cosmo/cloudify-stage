/**
 * Created by kinneretzin on 29/08/2016.
 */

import React, { Component } from 'react';

import SideBar from '../containers/SideBar';
import Page from '../containers/Page';
import ToursButton from '../containers/ToursButton';

export default class Home extends Component {
    constructor(props, context) {
        super(props, context);
    }

    // TODO: Context handling should not be here. Currently necessary to use deprecated methods.
    UNSAFE_componentWillMount() {
        this.props.onStorePageId(this.props.pageId);
        this.handleContext(this.props.contextParams);
    }

    // TODO: Context handling should not be here. Currently necessary to use deprecated methods.
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.pageId !== this.props.pageId) {
            this.props.onStorePageId(nextProps.pageId);
            this.handleContext(nextProps.contextParams);
        }
    }

    componentDidUpdate() {
        if (this.props.isMaintenance) {
            this.props.navigateToMaintenancePage();
        }

        if (this.props.emptyPages) {
            this.props.navigateToError(
                'No pages available to display. Please try to reset application to the default settings.'
            );
        }

        if (!this.props.selectedPage) {
            this.props.navigateTo404();
        }
    }

    handleContext(contextParams) {
        // Always clear the context. Whatever is relevant to the drilldown should be passed as drilldown context
        this.props.onClearContext();

        // Go over all the drilldown context and set it all (from top down)
        _.each(contextParams, cp => {
            _.each(cp.context, (value, key) => {
                this.props.onSetContextValue(key, value);
            });
        });

        this.props.onSetDrilldownContext(contextParams);
    }

    render() {
        if (this.props.emptyPages) {
            return null;
        }

        const { pageId } = this.props;
        const { pageName } = this.props;

        return (
            <div className="main">
                <ToursButton />

                <SideBar pageId={pageId} />

                <div className="page">
                    <div className="ui basic segment">
                        <Page pageId={pageId} pageName={pageName} />
                    </div>
                </div>
            </div>
        );
    }
}
