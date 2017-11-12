/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import Header from '../../containers/layout/Header';

import StatusPoller from '../../utils/StatusPoller';
import UserAppDataAutoSaver from '../../utils/UserAppDataAutoSaver';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import {NO_TENANTS_ERR, UNAUTHORIZED_ERR} from '../../utils/ErrorCodes';

export default class Layout extends Component {
    constructor(props,context) {
        super(props,context);
        this.state = Layout.initialState;
    }

    static propTypes = {
        children: PropTypes.element.isRequired,
        isLoading: PropTypes.bool.isRequired,
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
            <div>
                <Header />
                {this.props.children}
            </div>
        );
    }
}
