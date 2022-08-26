import { push } from 'connected-react-router';
import i18n from 'i18next';
import _ from 'lodash';

import { parse } from 'query-string';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { RouteComponentProps } from 'react-router';
import type { Dispatch } from 'redux';
import { storeCurrentPageId } from '../actions/app';
import { setAppError } from '../actions/appState';
import { clearContext, setValue } from '../actions/context';
import { setDrilldownContext } from '../actions/drilldownContext';
import { createPagesMap } from '../actions/pageMenu';
import type { ReduxState } from '../reducers';
import type { DrilldownContext } from '../reducers/drilldownContextReducer';
import Consts from '../utils/consts';
import ContactDetailsModal from './ContactDetailsModal';
import GettingStartedModal from './GettingStartedModal';
import Page from './Page';
import SideBar, { collapsedSidebarWidth, expandedSidebarWidth } from './sidebar/SideBar';

type ContextParams = DrilldownContext[];

interface HomeCallbackProps {
    navigateTo404: () => void;
    navigateToError: (message: string) => void;
    navigateToMaintenancePage: () => void;
    onClearContext: () => void;
    onSetContextValue: (key: string, value: any) => void;
    onSetDrilldownContext: (context: ContextParams) => void;
    onStorePageId: (pageId: string) => void;
}

interface HomeProps extends HomeCallbackProps {
    contextParams: ContextParams;
    emptyPages: boolean;
    isEditMode: boolean;
    isMaintenance: boolean;
    pageExists: boolean;
    pageId: string;
    pageName: string;
}

class Home extends Component<HomeProps> {
    componentDidMount() {
        const { contextParams, onStorePageId, pageId } = this.props;
        onStorePageId(pageId);
        this.handleContext(contextParams);
    }

    componentDidUpdate(prevProps: HomeProps) {
        const { contextParams, onStorePageId, pageId } = this.props;
        if (prevProps.pageId !== pageId) {
            onStorePageId(pageId);
            this.handleContext(contextParams);
        }

        const { emptyPages, isMaintenance, navigateTo404, navigateToError, navigateToMaintenancePage, pageExists } =
            this.props;
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

        if (!pageExists) {
            navigateTo404();
        }
    }

    handleContext(contextParams: ContextParams) {
        const { onClearContext, onSetContextValue, onSetDrilldownContext } = this.props;
        // Always clear the context. Whatever is relevant to the drilldown should be passed as drilldown context
        onClearContext();

        if (contextParams) {
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

const mapStateToProps = (state: ReduxState, ownProps: RouteComponentProps<{ pageId: string; pageName: string }>) => {
    const { pages } = state;
    const homePageId = _.isEmpty(pages) ? '' : pages[0].id;
    const selectedPageId = ownProps.match.params.pageId || homePageId;
    const selectedPageName = ownProps.match.params.pageName || '';

    const query = parse(ownProps.location.search);
    const context = query.c ? JSON.parse(query.c as string) : [];

    return {
        emptyPages: _.isEmpty(pages),
        pageExists: !!createPagesMap(pages)[selectedPageId],
        pageId: selectedPageId,
        pageName: selectedPageName,
        contextParams: context,
        isMaintenance: state.manager.maintenance === Consts.MAINTENANCE_ACTIVATED,
        isEditMode: state.config.isEditMode || false
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
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
            dispatch(push(Consts.PAGE_PATH.ERROR_404));
        },
        navigateToError: message => {
            dispatch(setAppError(message));
            dispatch(push(Consts.PAGE_PATH.ERROR));
        },
        navigateToMaintenancePage: () => {
            dispatch(push(Consts.PAGE_PATH.MAINTENANCE));
        },
        onStorePageId: pageId => {
            dispatch(storeCurrentPageId(pageId));
        }
    } as HomeCallbackProps;
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
