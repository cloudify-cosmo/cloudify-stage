/**
 * Created by jakub.niezgoda on 13/08/2018.
 */

import React, { Component } from 'react';

import PropTypes from 'prop-types';

export default class WizardButton extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            open: false
        }
    }

    static propTypes = {
        color: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        steps: Stage.Basic.Wizard.Modal.propTypes.steps,
        toolbox: PropTypes.object.isRequired
    };

    openWizard(event) {
        event.stopPropagation();
        this.setState({open: true});
    }

    closeWizard() {
        this.setState({open: false});
    }

    render() {
        let {Wizard, Button} = Stage.Basic;
        const {color, name, steps, toolbox} = this.props;

        return (
            <React.Fragment>
                <Button content={name} color={color} onClick={this.openWizard.bind(this)} fluid />
                <Wizard.Modal header={name} open={this.state.open} steps={steps}
                              onClose={this.closeWizard.bind(this)} toolbox={toolbox} />
            </React.Fragment>
        );
    }
}
