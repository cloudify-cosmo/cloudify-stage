import _ from 'lodash';
import React, { Component } from 'react';
import { parse } from 'query-string';

import styled from 'styled-components';
import { Button, Input, Message, Form, FullScreenSegment } from './basic';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';
import LogoLabel from './banner/LogoLabel';
import LargeLogo from './banner/LargeLogo';
import StageUtils from '../utils/stageUtils';

export interface LoginPageProps {
    isLoggingIn: boolean;
    isSamlEnabled: boolean;
    onLogin: (username: string, password: string, redirect: Redirect) => void;
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

type Redirect = string | null;

const StyledInput = styled(Input)`
    &&&&&& input:autofill,
    input:autofill:focus,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 100px transparent !important;
        box-shadow: 0 0 0 100px transparent inset !important;
        border-color: transparent !important;
    }
`;

const t = StageUtils.getT('login');

export default class LoginPage extends Component<LoginPageProps, LoginPageState> {
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

        if (_.isEmpty(username)) {
            errors.username = t('error.noUsername');
        }
        if (_.isEmpty(password)) {
            errors.password = t('error.noPassword');
        }
        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        const query = parse(location.search);
        const redirect = (query.redirect as string) || null;

        return onLogin(username, password, redirect);
    };

    handleInputChange = (_proxy: any, field: Parameters<typeof Stage.Basic.Form.fieldNameValue>[0]) => {
        const fieldNameValue = Form.fieldNameValue(field);
        this.setState({ ...fieldNameValue, errors: {} });
    };

    render() {
        const { errors, password, username } = this.state;
        const { isLoggingIn, isSamlEnabled, loginError = null } = this.props;
        SplashLoadingScreen.turnOff();

        const loginPageHeader = t('header');
        const loginPageHeaderColor = _.get(this.props, 'whiteLabel.loginPageHeaderColor');
        const loginPageText = t('message');
        const loginPageTextColor = _.get(this.props, 'whiteLabel.loginPageTextColor');
        const isHeaderTextPresent = !_.isEmpty(loginPageHeader) || !_.isEmpty(loginPageText);

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
