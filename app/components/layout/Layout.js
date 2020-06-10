/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Home from '../../containers/Home';

import Header from '../../containers/layout/Header';
import PageManagement from '../templates/PageManagement';
import Consts from '../../utils/consts';
import { NO_TENANTS_ERR, UNAUTHORIZED_ERR } from '../../utils/ErrorCodes';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';

import StatusPoller from '../../utils/StatusPoller';
import UserAppDataAutoSaver from '../../utils/UserAppDataAutoSaver';
import ScrollToTop from './ScrollToTop';
import TemplateManagement from '../templates/TemplateManagement';

export default class Layout extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = Layout.initialState;
    }

    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        isUserAuthorizedForTemplateManagement: PropTypes.bool.isRequired,
        intialPageLoad: PropTypes.func.isRequired
    };

    static initialState = {
        initialized: false
    };

    componentDidMount() {
        const { doLogout, intialPageLoad } = this.props;
        console.log('First time logging in , fetching stuff');

        intialPageLoad()
            .then(() => {
                StatusPoller.getPoller().start();
                UserAppDataAutoSaver.getAutoSaver().start();
                this.setState({ initialized: true });
            })
            .catch(e => {
                switch (e) {
                    case NO_TENANTS_ERR:
                        doLogout(null, 'noTenants');
                        break;
                    case UNAUTHORIZED_ERR:
                        break;
                    default:
                        doLogout('Error initializing user data, cannot load page');
                }
            });
    }

    componentWillUnmount() {
        StatusPoller.getPoller().stop();
        UserAppDataAutoSaver.getAutoSaver().stop();
    }

    render() {
        const { isLoading, isUserAuthorizedForTemplateManagement } = this.props;
        const { initialized } = this.state;

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
                <Header />
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
                    <Route exact path="/page/:pageId/:pageName" component={Home} />
                    <Route exact path="/page/:pageId" component={Home} />
                    <Route exact path={Consts.HOME_PAGE_PATH} component={Home} />
                    <Route render={() => <Redirect to={Consts.ERROR_404_PAGE_PATH} />} />
                </Switch>
            </ScrollToTop>
        );
    }
}
