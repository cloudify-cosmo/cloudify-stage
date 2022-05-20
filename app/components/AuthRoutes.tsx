import { get, isEmpty } from 'lodash';
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
import type { AuthUserResponse } from '../../backend/routes/Auth.types';

const AuthRoutes: FunctionComponent = () => {
    const [isManagerDataFetched, setManagerDataFetched] = useBoolean();
    const isInMaintenanceMode = useSelector(
        state => get(state, 'manager.maintenance') === Consts.MAINTENANCE_ACTIVATED
    );
    const isLicenseRequired = useSelector(state => get(state, 'manager.license.isRequired', false));
    const isProductOperational = useSelector(state => Auth.isProductOperational(get(state, 'manager.license', {})));
    const dispatch = useDispatch();

    useEffect(() => {
        SplashLoadingScreen.turnOn();

        dispatch(getManagerData())
            .then(() => dispatch(getTenants()))
            .then(() => dispatch(getUserData()))
            .then(({ tenantsRoles, role }: AuthUserResponse) => {
                if (isEmpty(tenantsRoles) && role !== Consts.ROLE.SYS_ADMIN) {
                    return Promise.reject(NO_TENANTS_ERR);
                }
                setManagerDataFetched();
                return Promise.resolve();
            })
            .catch((error: any) => {
                switch (error) {
                    case NO_TENANTS_ERR:
                        dispatch(logout(null, Consts.PAGE_PATH.ERROR_NO_TENANTS));
                        break;
                    default:
                        log.error(i18n.t('managerDataError'), error);
                        dispatch(logout(i18n.t('managerDataError')));
                }
            });
    }, []);

    return isManagerDataFetched ? (
        <Switch>
            {isLicenseRequired && <Route exact path={Consts.PAGE_PATH.LICENSE} component={LicensePage} />}
            <Route exact path={Consts.PAGE_PATH.MAINTENANCE} component={MaintenanceMode} />
            {isInMaintenanceMode && <Redirect to={Consts.PAGE_PATH.MAINTENANCE} />}
            <Route render={() => (isProductOperational ? <Layout /> : <Redirect to={Consts.PAGE_PATH.LICENSE} />)} />
        </Switch>
    ) : null;
};

export default AuthRoutes;
