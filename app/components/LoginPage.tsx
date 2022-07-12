import { get, isEmpty } from 'lodash';
import { parse } from 'query-string';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import type { Dispatch } from 'redux';
import type { ReduxState } from '../reducers';

import { login } from '../actions/managers';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';
import StageUtils from '../utils/stageUtils';
import LargeLogo from './banner/LargeLogo';
import LogoLabel from './banner/LogoLabel';
import { Button, Form, FullScreenSegment, Input, Message } from './basic';

export interface LoginPageProps {
    isLoggingIn: boolean;
    isSamlEnabled: boolean;
    onLogin: (username: string, password: string, redirect?: string) => void;
    location: {
        search: string;
    };
    loginError: string | null;
    samlSsoUrl: string;
    username: string;
    whiteLabel: {
        loginPageHeaderColor: string;
        loginPageTextColor: string;
    };
}

interface LoginPageState {
    username: string;
    password: string;
    errors: Errors;
}

type Errors = {
    username?: string;
    password?: string;
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

const t = StageUtils.getT('login');

class LoginPage extends Component<LoginPageProps, LoginPageState> {
    constructor(props: LoginPageProps, context: any) {
        super(props, context);

        this.state = {
            username: props.username,
            password: '',
            errors: {}
        };
    }

    onSubmit = () => {
        const { password, username } = this.state;
        const { isSamlEnabled, location, onLogin, samlSsoUrl = '' } = this.props;
        const errors: Errors = {};

        if (isSamlEnabled) {
            // eslint-disable-next-line scanjs-rules/assign_to_href
            window.location.href = samlSsoUrl;
        }

        if (isEmpty(username)) {
            errors.username = t('error.noUsername');
        }
        if (isEmpty(password)) {
            errors.password = t('error.noPassword');
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
        const { errors, password, username } = this.state;
        const { isLoggingIn, isSamlEnabled, loginError = null } = this.props;
        SplashLoadingScreen.turnOff();

        const loginPageHeader = t('header');
        const loginPageHeaderColor = get(this.props, 'whiteLabel.loginPageHeaderColor');
        const loginPageText = t('message');
        const loginPageTextColor = get(this.props, 'whiteLabel.loginPageTextColor');
        const isHeaderTextPresent = !isEmpty(loginPageHeader) || !isEmpty(loginPageText);

        return (
            <FullScreenSegment>
                <div className={`loginContainer ${isHeaderTextPresent ? 'loginContainerExtended' : ''}`}>
                    <LargeLogo />
                    {isHeaderTextPresent && (
                        <div style={{ textAlign: 'center', marginBottom: 30 }}>
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
                        </div>
                    )}

                    <Form onSubmit={this.onSubmit}>
                        {!isSamlEnabled && (
                            <>
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
                            </>
                        )}

                        {loginError && (
                            <Message error style={{ display: 'block' }}>
                                {loginError}
                            </Message>
                        )}

                        <Button
                            disabled={isLoggingIn}
                            loading={isLoggingIn}
                            color="yellow"
                            size="large"
                            type="submit"
                            content={t(isSamlEnabled ? 'ssoSubmit' : 'submit')}
                        />
                    </Form>
                </div>
            </FullScreenSegment>
        );
    }
}

const mapStateToProps = (state: ReduxState) => {
    const { config, manager } = state;
    return {
        username: manager.auth.username,
        isLoggingIn: manager.auth.state === 'loggingIn',
        loginError: manager.auth.error,
        mode: get(config, 'mode'),
        whiteLabel: get(config, 'app.whiteLabel'),
        isSamlEnabled: get(config, 'app.saml.enabled', false),
        samlSsoUrl: get(config, 'app.saml.ssoUrl', '')
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onLogin: (username: string, password: string, redirect?: string) => {
            dispatch(login(username, password, redirect));
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage));
