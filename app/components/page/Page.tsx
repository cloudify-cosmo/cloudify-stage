import { push } from 'connected-react-router';
import i18n from 'i18next';
import _ from 'lodash';

import { parse } from 'query-string';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { RouteComponentProps } from 'react-router';
import type { ReduxThunkDispatch } from 'app/configureStore';
import { storeCurrentPageId, showAppError } from '../../actions/app';
import { clearContext, setValue } from '../../actions/context';
import type { DrilldownContext } from '../../actions/drilldownContext';
import { setDrilldownContext } from '../../actions/drilldownContext';
import { createPagesMap } from '../../actions/pageMenu';
import type { ReduxState } from '../../reducers';
import Consts from '../../utils/consts';
import ContactDetailsModal from '../overlays/contactDetails';
import GettingStartedModal from '../overlays/gettingStarted';
import PageContainer from './content/PageContainer';
import SideBar, { collapsedSidebarWidth, expandedSidebarWidth } from '../sidebar/SideBar';

type ContextParams = DrilldownContext[];

interface PageCallbackProps {
    navigateTo404: () => void;
    navigateToError: (message: string) => void;
    navigateToMaintenancePage: () => void;
    onClearContext: () => void;
    onSetContextValue: (key: string, value: any) => void;
    onSetDrilldownContext: (context: ContextParams) => void;
    onStorePageId: (pageId: string) => void;
}

interface PageProps extends PageCallbackProps {
    contextParams: ContextParams;
    emptyPages: boolean;
    isEditMode: boolean;
    isMaintenance: boolean;
    pageExists: boolean;
    pageId: string;
    pageName: string;
}

class Page extends Component<PageProps> {
    componentDidMount() {
        const { contextParams, onStorePageId, pageId } = this.props;
        onStorePageId(pageId);
        this.handleContext(contextParams);
    }

    componentDidUpdate(prevProps: PageProps) {
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
            navigateToError(i18n.t('errors.noPages'));
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
                        <PageContainer pageId={pageId} pageName={pageName} />
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

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => {
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
            dispatch(showAppError(message));
        },
        navigateToMaintenancePage: () => {
            dispatch(push(Consts.PAGE_PATH.MAINTENANCE));
        },
        onStorePageId: pageId => {
            dispatch(storeCurrentPageId(pageId));
        }
    } as PageCallbackProps;
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
