/**
 * Created by kinneretzin on 29/08/2016.
 */


import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import Header from '../../containers/layout/Header';

import StatusPoller from '../../utils/StatusPoller';
import UserAppDataAutoSaver from '../../utils/UserAppDataAutoSaver';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import {NO_TENANTS_ERR, UNAUTHORIZED_ERR} from '../../utils/ErrorCodes';
import Consts from '../../utils/consts';
import TemplateManagement from '../../containers/templates/TemplateManagement';
import PageManagement from '../../containers/templates/PageManagement';
import Home from '../../containers/Home';
import NotFound from '../NotFound';
import ScrollToTop from './ScrollToTop';

export default class Layout extends Component {
    constructor(props,context) {
        super(props,context);
        this.state = Layout.initialState;
    }

    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        isUserAuthorizedForTemplateManagement: PropTypes.bool.isRequired,
        isPageSetForPageManagement: PropTypes.bool,
        intialPageLoad: PropTypes.func.isRequired
    };

    static initialState = {
        initialized: false
    };

    componentDidMount() {
        console.log('First time logging in , fetching stuff');

        this.props.intialPageLoad()
            .then(()=>{
                StatusPoller.getPoller().start();
                UserAppDataAutoSaver.getAutoSaver().start();
                this.setState({initialized: true});
            })
            .catch((e)=>{
                switch(e) {
                    case NO_TENANTS_ERR:
                        this.props.doLogout(null, 'noTenants');
                        break;
                    case UNAUTHORIZED_ERR:
                        break;
                    default:
                        this.props.doLogout('Error initializing user data, cannot load page');
                }
            });
    }

    componentWillUnmount() {
        StatusPoller.getPoller().stop();
        UserAppDataAutoSaver.getAutoSaver().stop();
    }

    render() {
        if (this.props.isLoading) {
            SplashLoadingScreen.turnOn();
            return null;
        }
        SplashLoadingScreen.turnOff();

        if (!this.state.initialized) {
            return null;
        }

        return (
            <ScrollToTop>
                <Header />
                <Switch>
                    {
                        this.props.isUserAuthorizedForTemplateManagement &&
                        <Route exact path='/template_management' component={TemplateManagement} />
                    }
                    {
                        this.props.isUserAuthorizedForTemplateManagement && this.props.isPageSetForPageManagement &&
                        <Route exact path='/page_management' component={PageManagement} />
                    }
                    <Route exact path='/page/:pageId/:pageName' component={Home}/>
                    <Route exact path='/page/:pageId' component={Home}/>
                    <Route exact path={Consts.HOME_PAGE_PATH} component={Home} />
                    <Route render={() => <Redirect to={Consts.ERROR_404_PAGE_PATH} />} />
                </Switch>
            </ScrollToTop>
        );
    }
}
