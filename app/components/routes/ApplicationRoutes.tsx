import i18n from 'i18next';
import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import log from 'loglevel';
import { useDispatch, useSelector } from 'react-redux';
import type { ReduxState } from '../../reducers';
import type { ReduxThunkDispatch } from '../../configureStore';

import intialPageLoad from '../../actions/initialPageLoad';
import { logout } from '../../actions/manager/auth';
import stageUtils from '../../utils/stageUtils';
import WidgetsPage from '../widgetsPage/WidgetsPage';
import PageManagement from '../templateManagement/pages/PageManagement';
import Consts from '../../utils/consts';
import { NO_PAGES_FOR_TENANT_ERR, UNAUTHORIZED_ERR } from '../../utils/ErrorCodes';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import StatusPoller from '../../utils/StatusPoller';
import UserAppDataAutoSaver from '../../utils/UserAppDataAutoSaver';
import ScrollToTop from './ScrollToTop';
import TemplateManagement from '../templateManagement/TemplateManagement';
import { useBoolean } from '../../utils/hooks';

export default function ApplicationRoutes() {
    const [initialized, setInitialized] = useBoolean(false);
    const isLoading = useSelector((state: ReduxState) => state.app.loading);
    const isUserAuthorizedForTemplateManagement = useSelector(
        (state: ReduxState) =>
            state.manager &&
            state.manager.permissions &&
            stageUtils.isUserAuthorized(Consts.permissions.STAGE_TEMPLATE_MANAGEMENT, state.manager)
    );
    const dispatch: ReduxThunkDispatch = useDispatch();
    const doLogout = (err: string) => {
        return dispatch(logout(err));
    };
    useEffect(() => {
        dispatch(intialPageLoad())
            .then(() => {
                StatusPoller.getPoller()!.start();
                UserAppDataAutoSaver.getAutoSaver()!.start();
                setInitialized();
            })
            .catch((err: string) => {
                switch (err) {
                    case UNAUTHORIZED_ERR: // Handled by Interceptor
                        break;
                    case NO_PAGES_FOR_TENANT_ERR:
                        log.error('Cannot initialize user data because no pages were found for the current tenant');
                        doLogout(i18n.t('noPages'));
                        break;
                    default:
                        log.error('Initializing user data failed', err);
                        doLogout(i18n.t('pageLoadError', 'Error initializing user data, cannot load page'));
                }
            });

        return () => {
            StatusPoller.getPoller()!.stop();
            UserAppDataAutoSaver.getAutoSaver()!.stop();
        };
    }, []);

    if (isLoading) {
        SplashLoadingScreen.turnOn();
        return null;
    }
    SplashLoadingScreen.turnOff();

    if (!initialized) {
        return null;
    }

    return (
        <ScrollToTop>
            <Switch>
                {isUserAuthorizedForTemplateManagement && (
                    <Route exact path="/template_management" component={TemplateManagement} />
                )}
                {isUserAuthorizedForTemplateManagement && (
                    <Route
                        exact
                        path="/page_preview/:pageId"
                        render={({ match }) => <PageManagement pageId={match.params.pageId} />}
                    />
                )}
                {isUserAuthorizedForTemplateManagement && (
                    <Route
                        exact
                        path="/page_edit/:pageId"
                        render={({ match }) => <PageManagement pageId={match.params.pageId} isEditMode />}
                    />
                )}
                <Route exact path="/page/:pageId/:pageName" component={WidgetsPage} />
                <Route exact path="/page/:pageId" component={WidgetsPage} />
                <Route exact path={Consts.PAGE_PATH.HOME} component={WidgetsPage} />
                <Route render={() => <Redirect to={Consts.PAGE_PATH.ERROR_404} />} />
            </Switch>
        </ScrollToTop>
    );
}
