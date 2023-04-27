import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { LoginPageProps } from 'cloudify-ui-components';
import { LoginPage as CommonLoginPage } from 'cloudify-ui-components';
import type { ReduxThunkDispatch } from 'app/configureStore';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import Consts from '../../utils/consts';
import StageUtils from '../../utils/stageUtils';
import type { ReduxState } from '../../reducers';
import { login } from '../../actions/manager/auth';

export default function LoginPage(props: Pick<LoginPageProps, 'location'>) {
    const dispatch: ReduxThunkDispatch = useDispatch();

    const { config, manager } = useSelector((state: ReduxState) => state);
    const { username, state: loginState } = manager.auth;
    const { whiteLabel } = config.app;
    const { loginPageUrl } = config.app.auth;

    return (
        <CommonLoginPage
            isLoggingIn={loginState === 'loggingIn'}
            onLogin={(...args) => dispatch(login(...args))}
            contextPath={Consts.CONTEXT_PATH}
            defaultLoginPagePath={Consts.PAGE_PATH.LOGIN}
            translate={StageUtils.getT('login')}
            initialUsername={username}
            onRender={SplashLoadingScreen.turnOff}
            loginPageUrl={loginPageUrl}
            {...whiteLabel}
            {...props}
        />
    );
}
