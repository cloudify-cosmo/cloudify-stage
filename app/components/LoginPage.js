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
    static propTypes = {
        username: PropTypes.string,
        loginError: PropTypes.string,
        onLogin: PropTypes.func.isRequired,
        isLoggingIn: PropTypes.bool.isRequired,
        whiteLabel: PropTypes.object
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            username: props.username || '',
            password: '',
            errors: {}
        };
    }

    onSubmit() {
        const errors = {};

        if (_.isEmpty(this.state.username)) {
            errors.username = 'Please provide username';
        }
        if (_.isEmpty(this.state.password)) {
            errors.password = 'Please provide password';
        }
        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        const query = parse(this.props.location.search);
        const redirect = query.redirect || null;

        this.props.onLogin(this.state.username, this.state.password, redirect);
    }

    _handleInputChange(proxy, field) {
        const fieldNameValue = Form.fieldNameValue(field);
        this.setState({ ...fieldNameValue, errors: {} });
    }

    render() {
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
                        <Form.Field required error={this.state.errors.username}>
                            <Input
                                name="username"
                                type="text"
                                placeholder="Username"
                                autoFocus
                                value={this.state.username}
                                onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field required error={this.state.errors.password}>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        {this.props.loginError && (
                            <Message error style={{ display: 'block' }}>
                                {this.props.loginError}
                            </Message>
                        )}

                        <Button
                            disabled={this.props.isLoggingIn}
                            loading={this.props.isLoggingIn}
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
