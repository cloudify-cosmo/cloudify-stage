/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';
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
        const { emptyPages, pageId, pageName } = this.props;

        if (emptyPages) {
            return null;
        }

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

Home.propTypes = {
    contextParams: PropTypes.arrayOf(PropTypes.shape({ context: PropTypes.shape({}) })).isRequired,
    emptyPages: PropTypes.bool.isRequired,
    isMaintenance: PropTypes.bool.isRequired,
    navigateTo404: PropTypes.func.isRequired,
    navigateToError: PropTypes.func.isRequired,
    navigateToMaintenancePage: PropTypes.func.isRequired,
    onClearContext: PropTypes.func.isRequired,
    onSetContextValue: PropTypes.func.isRequired,
    onSetDrilldownContext: PropTypes.func.isRequired,
    onStorePageId: PropTypes.func.isRequired,
    pageId: PropTypes.string.isRequired,
    pageName: PropTypes.string.isRequired,
    selectedPage: PropTypes.shape({})
};

Home.defaultProps = {
    selectedPage: null
};
