// @ts-nocheck File not migrated fully to TS

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import i18n from 'i18next';

import { parse } from 'query-string';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import SideBar, { collapsedSidebarWidth, expandedSidebarWidth } from './sidebar/SideBar';
import Page from './Page';
import GettingStartedModal from './GettingStartedModal';
import ContactDetailsModal from './ContactDetailsModal';
import { createPagesMap } from '../actions/pageMenu';
import Consts from '../utils/consts';
import { clearContext, setValue } from '../actions/context';
import { setDrilldownContext } from '../actions/drilldownContext';
import { setAppError } from '../actions/appState';
import { storeCurrentPageId } from '../actions/app';

class Home extends Component {
    // TODO: Context handling should not be here. Currently necessary to use deprecated methods.
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillMount() {
        const { contextParams, onStorePageId, pageId } = this.props;
        onStorePageId(pageId);
        this.handleContext(contextParams);
    }

    // TODO: Context handling should not be here. Currently necessary to use deprecated methods.
    // eslint-disable-next-line camelcase
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
            navigateToError(
                i18n.t(
                    'noPages',
                    'No pages available to display. Please try to reset application to the default settings.'
                )
            );
        }

        if (!selectedPage) {
            navigateTo404();
        }
    }

    handleContext(contextParams) {
        const { onClearContext, onSetContextValue, onSetDrilldownContext } = this.props;
        // Always clear the context. Whatever is relevant to the drilldown should be passed as drilldown context
        onClearContext();

        if (contextParams) {
            /** @type {import('../reducers/drilldownContextReducer').DrilldownContext} */
            const currentPageContext = contextParams[contextParams.length - 1] || {};
            _.each(currentPageContext.context, (value, key) => {
                onSetContextValue(key, value);
            });
        }

        onSetDrilldownContext(contextParams);
    }

    render() {
        const { emptyPages, pageId, pageName, isEditMode } = this.props;

        if (emptyPages) {
            return null;
        }

        return (
            <div className="main">
                <SideBar pageId={pageId} />
                <ContactDetailsModal />
                <GettingStartedModal />

                <div className="page" style={{ marginLeft: isEditMode ? expandedSidebarWidth : collapsedSidebarWidth }}>
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

const mapStateToProps = (state, ownProps) => {
    const { pages } = state;
    const homePageId = _.isEmpty(pages) ? '' : pages[0].id;
    const selectedPageId = ownProps.match.params.pageId || homePageId;
    const selectedPageName = ownProps.match.params.pageName || '';

    const query = parse(ownProps.location.search);
    const context = query.c ? JSON.parse(query.c) : [];

    return {
        emptyPages: _.isEmpty(pages),
        selectedPage: createPagesMap(pages)[selectedPageId],
        pageId: selectedPageId,
        pageName: selectedPageName,
        contextParams: context,
        isMaintenance: state.manager.maintenance === Consts.MAINTENANCE_ACTIVATED,
        isEditMode: state.config.isEditMode || false
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onClearContext: () => {
            dispatch(clearContext());
        },
        onSetContextValue: (key, value) => {
            dispatch(setValue(key, value));
        },
        onSetDrilldownContext(drilldownContext) {
            dispatch(setDrilldownContext(drilldownContext));
        },
        navigateTo404: () => {
            dispatch(push(Consts.ERROR_404_PAGE_PATH));
        },
        navigateToError: message => {
            dispatch(setAppError(message));
            dispatch(push(Consts.ERROR_PAGE_PATH));
        },
        navigateToMaintenancePage: () => {
            dispatch(push(Consts.MAINTENANCE_PAGE_PATH));
        },
        onStorePageId: pageId => {
            dispatch(storeCurrentPageId(pageId));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
