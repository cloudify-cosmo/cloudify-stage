import { get, isEmpty } from 'lodash';
import i18n from 'i18next';
import log from 'loglevel';
import React, { useEffect } from 'react';
import type { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';

import { showAppError } from '../../actions/app';
import { useBoolean } from '../../utils/hooks';
import { getTenants } from '../../actions/manager/tenants';
import Auth from '../../utils/auth';
import Consts from '../../utils/consts';
import type { LogoutAction } from '../../actions/manager/auth';
import { getManagerData, getUserData } from '../../actions/manager/auth';
import ApplicationRoutes from './ApplicationRoutes';
import LicensePage from '../license/LicensePage';
import MaintenanceModePage from '../maintenanceMode/MaintenanceModePage';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import type { ReduxThunkDispatch } from '../../configureStore';

class NoTenantsError extends Error {}

const AuthRoutes: FunctionComponent = () => {
    const [isManagerDataFetched, setManagerDataFetched] = useBoolean();
    const isInMaintenanceMode = useSelector(
        state => get(state, 'manager.maintenance') === Consts.MAINTENANCE_ACTIVATED
    );
    const isLicenseRequired = useSelector(state => get(state, 'manager.license.isRequired', false));
    const isProductOperational = useSelector(state => Auth.isProductOperational(get(state, 'manager.license', {})));
    const dispatch: ReduxThunkDispatch<LogoutAction> = useDispatch();

    useEffect(() => {
        SplashLoadingScreen.turnOn();

        dispatch(getManagerData())
            .then(() => dispatch(getTenants()))
            .then(() => dispatch(getUserData()))
            .then(({ tenantsRoles, role }) => {
                if (isEmpty(tenantsRoles) && role !== Consts.ROLE.SYS_ADMIN) throw new NoTenantsError();
                setManagerDataFetched();
            })
            .catch((error: any) => {
                if (error instanceof NoTenantsError) {
                    dispatch(showAppError(i18n.t('errors.noTenants')));
                } else {
                    log.error(i18n.t('errors.managerData'), error);
                    dispatch(showAppError(i18n.t('errors.managerData')));
                }
            });
    }, []);

    return isManagerDataFetched ? (
        <Switch>
            {isLicenseRequired && <Route exact path={Consts.PAGE_PATH.LICENSE} component={LicensePage} />}
            <Route exact path={Consts.PAGE_PATH.MAINTENANCE} component={MaintenanceModePage} />
            {isInMaintenanceMode && <Redirect to={Consts.PAGE_PATH.MAINTENANCE} />}
            <Route
                render={() =>
                    isProductOperational ? <ApplicationRoutes /> : <Redirect to={Consts.PAGE_PATH.LICENSE} />
                }
            />
        </Switch>
    ) : null;
};

export default AuthRoutes;
