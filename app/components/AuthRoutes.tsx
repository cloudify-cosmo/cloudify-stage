import _ from 'lodash';
import i18n from 'i18next';
import log from 'loglevel';
import React, { useEffect } from 'react';
import type { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';

import { NO_TENANTS_ERR } from '../utils/ErrorCodes';
import { useBoolean } from '../utils/hooks';
import { getTenants } from '../actions/tenants';
import Auth from '../utils/auth';
import Consts from '../utils/consts';
import { getManagerData, getUserData, logout } from '../actions/managers';
import Layout from '../containers/layout/Layout';
import LicensePage from '../containers/LicensePage';
import MaintenanceMode from '../containers/maintenance/MaintenanceModePageMessage';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

const AuthRoutes: FunctionComponent = () => {
    const [isManagerDataFetched, setManagerDataFetched] = useBoolean();
    const [isUserDataFetched, setUserDataFetched] = useBoolean();
    const isInMaintenanceMode = useSelector(
        state => _.get(state, 'manager.maintenance') === Consts.MAINTENANCE_ACTIVATED
    );
    const isLicenseRequired = useSelector(state => _.get(state, 'manager.license.isRequired', false));
    const isProductOperational = useSelector(state => Auth.isProductOperational(_.get(state, 'manager.license', {})));
    const dispatch = useDispatch();

    useEffect(() => {
        SplashLoadingScreen.turnOn();

        dispatch(getManagerData())
            .then(() => dispatch(getTenants()))
            .then(setManagerDataFetched)
            .catch((error: any) => {
                log.error(i18n.t('managerDataError'), error);
                dispatch(logout(i18n.t('managerDataError')));
            });
    }, []);

    useEffect(() => {
        if (isProductOperational && isManagerDataFetched) {
            dispatch(getUserData())
                .then(({ tenantsRoles }: any) => {
                    if (_.isEmpty(tenantsRoles)) {
                        return Promise.reject(NO_TENANTS_ERR);
                    }
                    setUserDataFetched();
                    return Promise.resolve();
                })
                .catch((error: any) => {
                    switch (error) {
                        case NO_TENANTS_ERR:
                            dispatch(logout(null, Consts.PAGE_PATH.ERROR_NO_TENANTS));
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
            {isLicenseRequired && <Route exact path={Consts.PAGE_PATH.LICENSE} component={LicensePage} />}
            <Route exact path={Consts.PAGE_PATH.MAINTENANCE} component={MaintenanceMode} />
            {isInMaintenanceMode && <Redirect to={Consts.PAGE_PATH.MAINTENANCE} />}
            <Route
                render={() =>
                    isProductOperational ? isUserDataFetched && <Layout /> : <Redirect to={Consts.PAGE_PATH.LICENSE} />
                }
            />
        </Switch>
    ) : null;
};

export default AuthRoutes;
