import { get, isEmpty } from 'lodash';
import { parse } from 'query-string';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import type { ClientConfig } from 'backend/routes/Config.types';
import SmartRedirect from './SmartRedirect';
import { login } from '../../actions/manager/auth';
import type { ReduxState } from '../../reducers';
import renderMultilineText from '../../utils/shared/renderMultilineText';
import SplashLoadingScreen from '../../utils/SplashLoadingScreen';
import StageUtils from '../../utils/stageUtils';
import LargeLogo from '../sidebar/banner/LargeLogo';
import LogoLabel from '../sidebar/banner/LogoLabel';
import { Button, Form, FullScreenSegment, Input, Message, Popup } from '../basic';
import type { ReduxThunkDispatch } from '../../configureStore';
import Consts from '../../utils/consts';

export interface LoginPageProps {
    isLoggingIn: boolean;
    onLogin: (username: string, password: string, redirect?: string) => void;
    location: {
        search: string;
    };
    loginError: string | null;
    loginPageUrl: ClientConfig['app']['auth']['loginPageUrl'];
    username: string;
    whiteLabel: ClientConfig['app']['whiteLabel'];
}

interface LoginPageState {
    username: string;
    password: string;
    errors: Errors;
    isFirstLogin: boolean;
}

type Errors = {
    username?: string;
    password?: string;
    missingCredentials?: string;
} | null;

const StyledInput = styled(Input)`
    &&&&&& input:autofill,
    input:autofill:hover,
    input:autofill:focus,
    input:autofill:active {
        box-shadow: 0 0 0 100px transparent inset !important;
        border-color: transparent !important;
    }
`;

const StyledHeaderText = styled.div`
    text-align: center;
    margin-bottom: 30px;
`;

const t = StageUtils.getT('login');

class LoginPage extends Component<LoginPageProps, LoginPageState> {
    constructor(props: LoginPageProps, context: any) {
        super(props, context);

        this.state = {
            username: props.username,
            password: '',
            errors: {},
            isFirstLogin: false
        };
    }

    componentDidMount() {
        const { whiteLabel } = this.props;

        if (whiteLabel.showFirstLoginHint) {
            fetch(StageUtils.Url.url('/auth/first-login'))
                .then(response => response.json())
                .then(isFirstLogin => this.setState({ isFirstLogin }))
                .catch(error => {
                    log.debug('Error fetching first login status', error);
                });
        }
    }

    onSubmit = () => {
        const { password, username } = this.state;
        const { location, onLogin } = this.props;
        const errors: Errors = {};

        if (!username) {
            errors.username = t('error.noUsername');
        }
        if (!password) {
            errors.password = t('error.noPassword');
        }

        if (!username || !password) {
            errors.missingCredentials = t('error.missingCredentials');
        }

        if (!isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        const query = parse(location.search);
        const redirect = query.redirect as string;

        return onLogin(username, password, redirect);
    };

    handleInputChange = (_proxy: any, field: Parameters<typeof Form.fieldNameValue>[0]) => {
        const fieldNameValue = Form.fieldNameValue(field);
        this.setState({ ...fieldNameValue, errors: {} });
    };

    render() {
        const { errors, password, username, isFirstLogin } = this.state;
        const { loginPageUrl, isLoggingIn, loginError = null, whiteLabel } = this.props;
        SplashLoadingScreen.turnOff();

        const defaultLoginPageUrl = `${Consts.CONTEXT_PATH}${Consts.PAGE_PATH.LOGIN}`;
        if (loginPageUrl !== defaultLoginPageUrl) return <SmartRedirect url={loginPageUrl} />;

        const loginPageHeader = t('header');
        const { loginPageHeaderColor, loginPageTextColor } = whiteLabel;
        const loginPageText = t('message');
        const isHeaderTextPresent = !isEmpty(loginPageHeader) || !isEmpty(loginPageText);
        const errorMessage = errors?.missingCredentials || loginError;

        return (
            <FullScreenSegment>
                <div className={`loginContainer ${isHeaderTextPresent ? 'loginContainerExtended' : ''}`}>
                    <LargeLogo />
                    {isHeaderTextPresent && (
                        <StyledHeaderText>
                            {loginPageHeader && <LogoLabel color={loginPageHeaderColor} content={loginPageHeader} />}
                            {loginPageText && (
                                <p
                                    style={{
                                        color: loginPageTextColor,
                                        fontSize: '1.1em'
                                    }}
                                >
                                    {loginPageText}
                                </p>
                            )}
                        </StyledHeaderText>
                    )}

                    <Form onSubmit={this.onSubmit}>
                        <Popup
                            open={isFirstLogin}
                            content={renderMultilineText(t('firstLoginHint'))}
                            position="right center"
                            style={{ marginLeft: -25 }}
                            trigger={
                                <div>
                                    <Form.Field required error={errors?.username}>
                                        <StyledInput
                                            name="username"
                                            type="text"
                                            placeholder={t('username')}
                                            autoFocus
                                            value={username}
                                            onChange={this.handleInputChange}
                                        />
                                    </Form.Field>
                                    <Form.Field required error={errors?.password}>
                                        <StyledInput
                                            name="password"
                                            type="password"
                                            placeholder={t('password')}
                                            value={password}
                                            onChange={this.handleInputChange}
                                        />
                                    </Form.Field>
                                </div>
                            }
                        />

                        {errorMessage && (
                            <Message error style={{ display: 'block', backgroundColor: '#fdeded', boxShadow: 'none' }}>
                                {errorMessage}
                            </Message>
                        )}

                        <Button
                            disabled={isLoggingIn}
                            loading={isLoggingIn}
                            color="yellow"
                            size="large"
                            type="submit"
                            content={t('submit')}
                        />
                    </Form>
                </div>
            </FullScreenSegment>
        );
    }
}

const mapLoginError = (error: any) => {
    // eslint-disable-next-line
    console.log(error);

    return error;
};

const mapStateToProps = (state: ReduxState) => {
    const { config, manager } = state;
    return {
        username: manager.auth.username,
        loginPageUrl: config.app.auth.loginPageUrl,
        isLoggingIn: manager.auth.state === 'loggingIn',
        loginError: mapLoginError(manager.auth.error),
        mode: get(config, 'mode'),
        whiteLabel: get(config, 'app.whiteLabel')
    };
};

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => {
    return {
        onLogin: (username: string, password: string, redirect?: string) => {
            dispatch(login(username, password, redirect));
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage));
