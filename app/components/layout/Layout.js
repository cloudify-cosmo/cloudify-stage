/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import Header from '../../containers/layout/Header';

import StatusPoller from '../../utils/StatusPoller';
import UserAppDataAutoSaver from '../../utils/UserAppDataAutoSaver';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';

export default class Layout extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        isLoading: PropTypes.bool.isRequired,
        intialPageLoad: PropTypes.func.isRequired
    };

    componentDidMount() {
        console.log('First time logging in , fetching stuff');

        this.props.intialPageLoad()
            .then(()=>{
                StatusPoller.getPoller().start();
                UserAppDataAutoSaver.getAutoSaver().start();
            })
            .catch((e)=>{
                this.props.doLogout(e);
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
        return (
            <div>
                <Header />
                {this.props.children}
            </div>
        );
    }
}
