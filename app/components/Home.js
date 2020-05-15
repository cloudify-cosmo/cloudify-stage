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
        const { contextParams, onStorePageId, pageId } = this.props;
        onStorePageId(pageId);
        this.handleContext(contextParams);
    }

    // TODO: Context handling should not be here. Currently necessary to use deprecated methods.
    UNSAFE_componentWillReceiveProps(nextProps) {
        const { onStorePageId, pageId } = this.props;
        if (nextProps.pageId !== pageId) {
            onStorePageId(nextProps.pageId);
            this.handleContext(nextProps.contextParams);
        }
    }

    componentDidUpdate() {
        const {
            emptyPages,
            isMaintenance,
            navigateTo404,
            navigateToError,
            navigateToMaintenancePage,
            selectedPage
        } = this.props;
        if (isMaintenance) {
            navigateToMaintenancePage();
        }

        if (emptyPages) {
            navigateToError('No pages available to display. Please try to reset application to the default settings.');
        }

        if (!selectedPage) {
            navigateTo404();
        }
    }

    handleContext(contextParams) {
        const { onClearContext, onSetContextValue, onSetDrilldownContext } = this.props;
        // Always clear the context. Whatever is relevant to the drilldown should be passed as drilldown context
        onClearContext();

        // Go over all the drilldown context and set it all (from top down)
        _.each(contextParams, cp => {
            _.each(cp.context, (value, key) => {
                onSetContextValue(key, value);
            });
        });

        onSetDrilldownContext(contextParams);
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
