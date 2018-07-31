/**
 * Created by jakub.niezgoda on 26/07/2018.
 */

import React, { Component } from 'react';

import DeploymentWizardModal from './DeploymentWizardModal';

export default class HelloWorldWizardButton extends Component {

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
                <Button content='Hello World Wizard' color='blue' onClick={this._handleClick.bind(this)} />
                <DeploymentWizardModal open={this.state.open} onClose={() => this.setState({open: false})} />
            </React.Fragment>
        );
    }
}
