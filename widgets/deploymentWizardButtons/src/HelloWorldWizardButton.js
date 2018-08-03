/**
 * Created by jakub.niezgoda on 26/07/2018.
 */

import React, { Component } from 'react';

import InfrastructureStep from './steps/InfrastructureStep';
import PluginsStep from './steps/PluginsStep';
import SecretsStep from './steps/SecretsStep';
import InputsStep from './steps/InputsStep';
import InstallStep from './steps/InstallStep';
import PropTypes from 'prop-types';

export default class HelloWorldWizardButton extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            open: false
        }
    }

    static propTypes = {
        toolbox: PropTypes.object.isRequired
    };

    _handleClick(event) {
        event.stopPropagation();
        this.setState({open: true});
    }

    render() {
        let {Wizard, Button} = Stage.Basic;
        let steps = [
            InfrastructureStep,
            PluginsStep,
            SecretsStep,
            InputsStep,
            InstallStep
        ];

        return (
            <React.Fragment>
                <Button content='Hello World Wizard' color='blue' onClick={this._handleClick.bind(this)} />
                <Wizard.Modal open={this.state.open} onClose={() => this.setState({open: false})} steps={steps} toolbox={this.props.toolbox} />
            </React.Fragment>
        );
    }
}
