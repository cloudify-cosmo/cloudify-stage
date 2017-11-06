/**
 * Created by kinneretzin on 10/11/2016.
 */

import React, { Component, PropTypes } from 'react';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

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
            password: ''
        };
    }

    onSubmit(e) {
        e.preventDefault();
        var redirect = this.props.location.query.redirect || null;
        this.props.onLogin(this.state.username, this.state.password, redirect);
    }

    render() {
        SplashLoadingScreen.turnOff();

        var isWhiteLabelEnabled = _.get(this.props,'whiteLabel.enabled');
        let loginPageHeader = _.get(this.props,'whiteLabel.loginPageHeader');
        let loginPageText = _.get(this.props,'whiteLabel.loginPageText');
        let isHeaderTextPresent = isWhiteLabelEnabled && (loginPageHeader || loginPageText);
        return (
                <div className={`loginContainer ${isHeaderTextPresent?'loginContainerExtended':''}`} >

                    {
                        isHeaderTextPresent &&
                        <div className="loginHeader">
                            {loginPageHeader && <h2>{loginPageHeader}</h2>}
                            {loginPageText && <p>{loginPageText}</p>}
                        </div>
                    }

                    <form className="ui huge form" onSubmit={this.onSubmit.bind(this)}>
                        <div className="field required">
                            <input type="text" name="username" placeholder="Enter user name" required autoFocus value={this.state.username} onChange={(e)=>this.setState({username: e.target.value})}/>
                        </div>
                        <div className="field required">
                            <input type="password" name="password" placeholder="Enter user password" required value={this.state.password} onChange={(e)=>this.setState({password: e.target.value})}/>
                        </div>

                        {
                            this.props.loginError ?
                                <div className="ui error message tiny" style={{'display':'block'}}>
                                    <p>{this.props.loginError}</p>
                                </div>
                                :
                                ''
                        }

                        <button className={'ui submit huge button ' + (this.props.isLoggingIn ? 'loading disabled' : '')} type="submit" disabled={this.props.isLoggingIn}>Login</button>
                    </form>
                </div>
        );
    }
}
