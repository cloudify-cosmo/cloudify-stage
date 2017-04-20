/**
 * Created by kinneretzin on 10/11/2016.
 */

import React, { Component, PropTypes } from 'react';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

export default class Login extends Component {

    static propTypes = {
        ip: PropTypes.string,
        username: PropTypes.string,
        loginError: PropTypes.string,
        onLogin: PropTypes.func.isRequired,
        shouldShowIpField: PropTypes.bool.isRequired,
        isLoggingIn: PropTypes.bool.isRequired,
        whiteLabel: PropTypes.object

    };

    constructor(props,context){
        super(props, context);

        this.state = {
            ip: props.ip || '',
            username: props.username || '',
            password: ''
        };
    }

    onSubmit(e) {
        e.preventDefault();

        this.props.onLogin(this.state.ip, this.state.username, this.state.password);
    }

    render() {
        SplashLoadingScreen.turnOff();

        var isWhiteLabelEnabled = _.get(this.props,'whiteLabel.enabled');
        let loginPageHeader = _.get(this.props,'whiteLabel.loginPageHeader');
        let loginPageText = _.get(this.props,'whiteLabel.loginPageText');
        let isHeaderTextPresent = isWhiteLabelEnabled && (loginPageHeader || loginPageText);
        return (
            <div className='loginPage ui segment basic inverted'>
                <div className="logo">
                </div>

                <div className={`loginContainer ${isHeaderTextPresent?'loginContainerExtended':''}`} >

                    {
                        isHeaderTextPresent &&
                        <div className="loginHeader">
                            {loginPageHeader && <h2>{loginPageHeader}</h2>}
                            {loginPageText && <p>{loginPageText}</p>}
                        </div>
                    }

                    <form className="ui huge form" onSubmit={this.onSubmit.bind(this)}>
                        {
                            this.props.shouldShowIpField &&
                            <div className="field required">
                                <input type="text" name="ip" placeholder="Enter Manager IP" required value={this.state.ip} onChange={(e)=>this.setState({ip: e.target.value})}/>
                            </div>
                        }
                        <div className="field required">
                            <input type="text" name="username" placeholder="Enter user name" required value={this.state.username} onChange={(e)=>this.setState({username: e.target.value})}/>
                        </div>
                        <div className="field required">
                            <input type="password" name="password" placeholder="Enter user password" required value={this.state.password} onChange={(e)=>this.setState({password: e.target.value})}/>
                        </div>

                        {
                            this.props.loginError ?
                                <div className="ui error message tiny" style={{"display":"block"}}>
                                    <p>{this.props.loginError}</p>
                                </div>
                                :
                                ''
                        }

                        <button className={"ui submit huge button " + (this.props.isLoggingIn ? 'loading disabled' : '')} type="submit" disabled={this.props.isLoggingIn}>Login</button>
                    </form>

                </div>
            </div>
        );
    }
}
