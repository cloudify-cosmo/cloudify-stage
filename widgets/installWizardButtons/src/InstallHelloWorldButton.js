/**
 * Created by jakub.niezgoda on 26/07/2018.
 */

import React, { Component } from 'react';

import InstallWizardModal from './InstallWizardModal';

export default class InstallHelloWorldButton extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            open: false
        }
    }

    _handleClick(event) {
        event.stopPropagation();
        this.setState({open: true});
    }

    render() {
        let {Button} = Stage.Basic;

        return (
            <React.Fragment>
                <Button content='Install Hello World' color='blue' onClick={this._handleClick.bind(this)} />
                <InstallWizardModal open={this.state.open} onClose={() => this.setState({open: false})} />
            </React.Fragment>
        );
    }
}
