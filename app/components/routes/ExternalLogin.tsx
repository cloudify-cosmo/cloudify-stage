import React, { useEffect } from 'react';
import i18n from 'i18next';
import type { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { showAppError } from '../../actions/app';
import { loginSuccess } from '../../actions/manager/auth';
import Auth from '../../utils/auth';
import type { ReduxState } from '../../reducers';
import Consts from '../../utils/consts';

const ExternalLogin: FunctionComponent = () => {
    const dispatch = useDispatch();
    const manager = useSelector((state: ReduxState) => state.manager);
    const isLoggedIn = useSelector((state: ReduxState) => state.manager.auth.state === 'loggedIn');

    useEffect(() => {
        Auth.getUserData(manager)
            .then(({ username, role }) => dispatch(loginSuccess(username, role)))
            .catch(() => dispatch(showAppError(i18n.t('errors.managerData'))));
    }, []);

    if (isLoggedIn) return <Redirect to={Consts.PAGE_PATH.HOME} />;

    return null;
};

export default ExternalLogin;
