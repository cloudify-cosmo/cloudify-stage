/**
 * Created by kinneretzin on 10/11/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { parse } from 'query-string';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';
import { Button, Input, Message, Form } from './basic';

export default class Login extends Component {

    static propTypes = {
        username: PropTypes.string,
        loginError: PropTypes.string,
        onLogin: PropTypes.func.isRequired,
        isLoggingIn: PropTypes.bool.isRequired,
        whiteLabel: PropTypes.object

    };

    constructor(props,context){
        super(props, context);

        this.state = {
            username: props.username || '',
            password: '',
            errors: {}
        };
    }

    onSubmit() {
        let errors = {};

        if (_.isEmpty(this.state.username)) {
            errors['username'] = 'Please provide username';
        }
        if (_.isEmpty(this.state.password)) {
            errors['password'] = 'Please provide password';
        }
        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        const query = parse(this.props.location.search);
        let redirect = query.redirect || null;

        this.props.onLogin(this.state.username, this.state.password, redirect);
    }

    _handleInputChange(proxy, field) {
        let fieldNameValue = Form.fieldNameValue(field);
        this.setState({...fieldNameValue, errors: {}});
    }

    render() {
        SplashLoadingScreen.turnOff();

        let isWhiteLabelEnabled = _.get(this.props,'whiteLabel.enabled');
        let loginPageHeader = _.get(this.props,'whiteLabel.loginPageHeader');
        let loginPageHeaderColor = _.get(this.props,'whiteLabel.loginPageHeaderColor','white');
        let loginPageText = _.get(this.props,'whiteLabel.loginPageText');
        let loginPageTextColor = _.get(this.props,'whiteLabel.loginPageTextColor','white');
        let isHeaderTextPresent = isWhiteLabelEnabled && (loginPageHeader || loginPageText);

        return (
                <div className={`loginContainer ${isHeaderTextPresent?'loginContainerExtended':''}`} >

                    {
                        isHeaderTextPresent &&
                        <div className="loginHeader">
                            {loginPageHeader && <h2 style={{color: loginPageHeaderColor}}>{loginPageHeader}</h2>}
                            {loginPageText && <p style={{color: loginPageTextColor}}>{loginPageText}</p>}
                        </div>
                    }

                    <Form size="huge" onSubmit={this.onSubmit.bind(this)}>
                        <Form.Field required error={this.state.errors.username}>
                            <Input fluid name="username" type="text" placeholder="Enter user name" autoFocus
                                   value={this.state.username} onChange={this._handleInputChange.bind(this)} />
                        </Form.Field>

                        <Form.Field required error={this.state.errors.password}>
                            <Input fluid name="password" type="password" placeholder="Enter user password"
                                   value={this.state.password} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        {
                            this.props.loginError &&
                            <Message error style={{display: 'block'}}>{this.props.loginError}</Message>
                        }

                        <Button size='huge' disabled={this.props.isLoggingIn} loading={this.props.isLoggingIn} type='submit'>Login</Button>
                    </Form>

                </div>
        );
    }
}
