/**
 * Created by kinneretzin on 10/11/2016.
 */

import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { parse } from 'query-string';
import i18n from 'i18next';
import { Button, Input, Message, Form, FullScreenSegment, Logo } from './basic';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

import 'cloudify-ui-common/styles/font-JosefinSans-Bold.css';

export default class LoginPage extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            username: props.username,
            password: '',
            errors: {}
        };
    }

    onSubmit = () => {
        const { password, username } = this.state;
        const { location, onLogin } = this.props;
        const errors = {};

        if (_.isEmpty(username)) {
            errors.username = i18n.t('login.error.noUsername', 'Please provide username');
        }
        if (_.isEmpty(password)) {
            errors.password = i18n.t('login.error.noPassword', 'Please provide password');
        }
        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        const query = parse(location.search);
        const redirect = query.redirect || null;

        return onLogin(username, password, redirect);
    };

    handleInputChange = (proxy, field) => {
        const fieldNameValue = Form.fieldNameValue(field);
        this.setState({ ...fieldNameValue, errors: {} });
    };

    render() {
        const { errors, password, username } = this.state;
        const { isLoggingIn, loginError } = this.props;
        SplashLoadingScreen.turnOff();

        const loginPageHeader = i18n.t('login.header');
        const loginPageHeaderColor = _.get(this.props, 'whiteLabel.loginPageHeaderColor');
        const loginPageText = i18n.t('login.message');
        const loginPageTextColor = _.get(this.props, 'whiteLabel.loginPageTextColor');
        const isHeaderTextPresent = !_.isEmpty(loginPageHeader) || !_.isEmpty(loginPageText);

        return (
            <FullScreenSegment>
                <div className={`loginContainer ${isHeaderTextPresent ? 'loginContainerExtended' : ''}`}>
                    <Logo
                        style={{
                            textAlign: 'center',
                            margin: '0 auto',
                            display: 'block',
                            width: 100,
                            height: 100
                        }}
                    />
                    {isHeaderTextPresent && (
                        <div style={{ textAlign: 'center', marginBottom: 30 }}>
                            {loginPageHeader && (
                                <h2
                                    style={{
                                        color: loginPageHeaderColor,
                                        fontSize: '2em',
                                        fontFamily: 'JosefinSans-Bold, sans-serif'
                                    }}
                                >
                                    {loginPageHeader}
                                </h2>
                            )}
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
                        <Form.Field required error={errors.username}>
                            <Input
                                name="username"
                                type="text"
                                placeholder={i18n.t('login.username', 'Username')}
                                autoFocus
                                value={username}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        <Form.Field required error={errors.password}>
                            <Input
                                name="password"
                                type="password"
                                placeholder={i18n.t('login.password', 'Password')}
                                value={password}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

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
                            content="LOGIN"
                        />
                    </Form>
                </div>
            </FullScreenSegment>
        );
    }
}

LoginPage.propTypes = {
    isLoggingIn: PropTypes.bool.isRequired,
    onLogin: PropTypes.func.isRequired,
    location: PropTypes.shape({ search: PropTypes.string }),
    loginError: PropTypes.string,
    username: PropTypes.string,
    whiteLabel: PropTypes.shape({
        loginPageHeaderColor: PropTypes.string,
        loginPageTextColor: PropTypes.string
    })
};

LoginPage.defaultProps = {
    location: { search: '' },
    loginError: null,
    username: '',
    whiteLabel: PropTypes.shape({
        loginPageHeaderColor: '',
        loginPageTextColor: ''
    })
};
