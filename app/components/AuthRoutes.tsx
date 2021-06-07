import _ from 'lodash';
import Cookies from 'js-cookie';
import i18n from 'i18next';
import log from 'loglevel';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';

import { NO_TENANTS_ERR } from '../utils/ErrorCodes';
import { useBoolean } from '../utils/hooks';
import { getTenants } from '../actions/tenants';
import Auth from '../utils/auth';
import Consts from '../utils/consts';
import { getManagerData, getUserData, logout, receiveLogin } from '../actions/managers';
import Layout from '../containers/layout/Layout';
import LicensePage from '../containers/LicensePage';
import MaintenanceMode from '../containers/maintenance/MaintenanceModePageMessage';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

export default function AuthRoutes({ isSamlEnabled }) {
    const [isManagerDataFetched, setManagerDataFetched /* , unsetManagerDataFetched */] = useBoolean();
    const [isUserDataFetched, setUserDataFetched /* , unsetUserDataFetched */] = useBoolean();
    const isInMaintenanceMode = useSelector(
        state => _.get(state, 'manager.maintenance') === Consts.MAINTENANCE_ACTIVATED
    );
    const isLicenseRequired = useSelector(state => _.get(state, 'manager.license.isRequired', false));
    const isProductOperational = useSelector(state => Auth.isProductOperational(_.get(state, 'manager.license', {})));
    const isSamlLogin = isSamlEnabled && !!Cookies.get(Consts.ROLE_COOKIE_NAME);
    const dispatch = useDispatch();

    useEffect(() => {
        SplashLoadingScreen.turnOn();

        if (isSamlLogin) {
            const role = Cookies.get(Consts.ROLE_COOKIE_NAME);
            const username = Cookies.get(Consts.USERNAME_COOKIE_NAME);
            dispatch(receiveLogin(username, role));
        }

        dispatch(getManagerData())
            .then(() => dispatch(getTenants()))
            .then(setManagerDataFetched)
            .catch(error => {
                log.error(i18n.t('managerDataError'), error);
                dispatch(logout(i18n.t('managerDataError')));
            });
    }, []);

    useEffect(() => {
        if (isProductOperational && isManagerDataFetched) {
            dispatch(getUserData())
                .then(({ tenantsRoles }) => {
                    if (_.isEmpty(tenantsRoles)) {
                        return Promise.reject(NO_TENANTS_ERR);
                    }
                    setUserDataFetched();
                    return Promise.resolve();
                })
                .catch(error => {
                    switch (error) {
                        case NO_TENANTS_ERR:
                            dispatch(logout(null, Consts.ERROR_NO_TENANTS_PAGE_PATH));
                            break;
                        default:
                            log.error(i18n.t('pageLoadError'), error);
                            dispatch(logout(i18n.t('pageLoadError')));
                    }
                });
        }
    }, [isProductOperational, isManagerDataFetched]);

    return isManagerDataFetched ? (
        <Switch>
            {isLicenseRequired && <Route exact path={Consts.LICENSE_PAGE_PATH} component={LicensePage} />}
            <Route exact path={Consts.MAINTENANCE_PAGE_PATH} component={MaintenanceMode} />
            {isInMaintenanceMode && <Redirect to={Consts.MAINTENANCE_PAGE_PATH} />}
            <Route
                render={() =>
                    isProductOperational ? isUserDataFetched && <Layout /> : <Redirect to={Consts.LICENSE_PAGE_PATH} />
                }
            />
        </Switch>
    ) : null;
}

AuthRoutes.propTypes = {
    isSamlEnabled: PropTypes.bool.isRequired
};
