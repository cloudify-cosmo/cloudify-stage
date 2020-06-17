/**
 * Created by kinneretzin on 10/11/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { parse } from 'query-string';

import { Button, Input, Message, Form } from './basic';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';
import Logo from './banner/Logo';
import FullScreenSegment from './layout/FullScreenSegment';

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

    onSubmit() {
        const { password, username } = this.state;
        const { location, onLogin } = this.props;
        const errors = {};

        if (_.isEmpty(username)) {
            errors.username = 'Please provide username';
        }
        if (_.isEmpty(password)) {
            errors.password = 'Please provide password';
        }
        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        const query = parse(location.search);
        const redirect = query.redirect || null;

        onLogin(username, password, redirect);
    }

    handleInputChange(proxy, field) {
        const fieldNameValue = Form.fieldNameValue(field);
        this.setState({ ...fieldNameValue, errors: {} });
    }

    render() {
        const { errors, password, username } = this.state;
        const { isLoggingIn, loginError } = this.props;
        SplashLoadingScreen.turnOff();

        const loginPageHeader = _.get(this.props, 'whiteLabel.loginPageHeader');
        const loginPageHeaderColor = _.get(this.props, 'whiteLabel.loginPageHeaderColor');
        const loginPageText = _.get(this.props, 'whiteLabel.loginPageText');
        const loginPageTextColor = _.get(this.props, 'whiteLabel.loginPageTextColor');
        const isHeaderTextPresent = !_.isEmpty(loginPageHeader) || !_.isEmpty(loginPageText);

        return (
            <FullScreenSegment>
                <div className={`loginContainer ${isHeaderTextPresent ? 'loginContainerExtended' : ''}`}>
                    <Logo />
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

                    <Form onSubmit={this.onSubmit.bind(this)}>
                        <Form.Field required error={errors.username}>
                            <Input
                                name="username"
                                type="text"
                                placeholder="Username"
                                autoFocus
                                value={username}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field required error={errors.password}>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={this.handleInputChange.bind(this)}
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
    location: PropTypes.string.isRequired,
    onLogin: PropTypes.func.isRequired,
    loginError: PropTypes.string,
    username: PropTypes.string,
    whiteLabel: PropTypes.shape({
        loginPageHeader: PropTypes.string,
        loginPageHeaderColor: PropTypes.string,
        loginPageText: PropTypes.string,
        loginPageTextColor: PropTypes.string
    })
};

LoginPage.defaultProps = {
    loginError: null,
    username: '',
    whiteLabel: PropTypes.shape({
        loginPageHeader: '',
        loginPageHeaderColor: '',
        loginPageText: '',
        loginPageTextColor: ''
    })
};
