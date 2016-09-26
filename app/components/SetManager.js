/**
 * Created by kinneretzin on 30/08/2016.
 */

/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

export default class SetManager extends Component {
    static propTypes = {
        onManagerSaved: PropTypes.func.isRequired
    };

    constructor(props,context){
        super(props, context);

        this.state = {
            name: props.name,
            ip: props.ip
        };
    }
    onSubmit(e) {
        e.preventDefault();

        this.props.onManagerSaved(this.state.name,this.state.ip);
    }


    render() {
        return (
            <div className='configManager ui segment basic inverted teal'>
                <div className="logo">
                    <img src="/app/images/Cloudify-logo.png"></img>
                </div>

                <div className='configManagerContainer'>
                    <form className="ui huge form" onSubmit={this.onSubmit.bind(this)}>
                        <div className="field required">
                            <input type="text" name="name" placeholder="Enter manager name" required value={this.state.name} onChange={(e)=>this.setState({name: e.target.value})}/>
                        </div>
                        <div className="field required">
                            <input type="text" name="ip" placeholder="Enter Manager IP" required value={this.state.ip} onChange={(e)=>this.setState({ip: e.target.value})}/>
                        </div>
                        <button className="ui submit huge button" type="submit">Set Manager</button>
                    </form>

                </div>
            </div>
        );
    }
}

