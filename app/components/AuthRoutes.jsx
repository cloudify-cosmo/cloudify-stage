import _ from 'lodash';
import i18n from 'i18next';
import log from 'loglevel';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { NO_TENANTS_ERR, UNAUTHORIZED_ERR } from '../utils/ErrorCodes';
import { getTenants } from '../actions/tenants';

import Auth from '../utils/auth';
import Consts from '../utils/consts';
import { getManagerData, getUserData, logout } from '../actions/managers';
import Layout from '../containers/layout/Layout';
import LicensePage from '../containers/LicensePage';
import MaintenanceMode from '../containers/maintenance/MaintenanceModePageMessage';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

export default function AuthRoutes() {
    const [isInitialized, setInitialized] = useState(false);
    const isInMaintenanceMode = useSelector(
        state => _.get(state, 'manager.maintenance') === Consts.MAINTENANCE_ACTIVATED
    );
    const isLicenseRequired = useSelector(state => _.get(state, 'manager.license.isRequired', false));
    const isProductOperational = useSelector(state => Auth.isProductOperational(_.get(state, 'manager.license', {})));
    const dispatch = useDispatch();

    useEffect(() => {
        SplashLoadingScreen.turnOn();
        Promise.all([dispatch(getManagerData()), dispatch(getUserData())])
            .then(() => dispatch(getTenants()))
            .then(tenants => {
                if (_.size(tenants.items) === 0) {
                    return Promise.reject(NO_TENANTS_ERR);
                }
                setInitialized(true);
                return Promise.resolve();
            })
            .catch(error => {
                switch (error) {
                    case NO_TENANTS_ERR:
                        dispatch(logout(null, Consts.ERROR_NO_TENANTS_PAGE_PATH));
                        break;
                    case UNAUTHORIZED_ERR: // Handled by Interceptor
                        break;
                    default:
                        log.error(error);
                        dispatch(logout(i18n.t('pageLoadError')));
                }
            });
    }, []);

    if (!isInitialized) {
        return null;
    }

    return (
        <Switch>
            {isLicenseRequired && <Route exact path={Consts.LICENSE_PAGE_PATH} component={LicensePage} />}
            <Route exact path={Consts.MAINTENANCE_PAGE_PATH} component={MaintenanceMode} />
            <Route
                render={props => {
                    if (isInMaintenanceMode) {
                        return <Redirect to={Consts.MAINTENANCE_PAGE_PATH} />;
                    }
                    if (isProductOperational) {
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        return <Layout {...props} />;
                    }
                    return <Redirect to={Consts.LICENSE_PAGE_PATH} />;
                }}
            />
        </Switch>
    );
}
