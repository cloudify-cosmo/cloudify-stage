/**
 * Created by jakub.niezgoda on 20/07/2018.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Steps from './inputs/Steps';

export default class InstallWizardModal extends Component {

    constructor(props,context) {
        super(props,context);

        this.steps = Steps;
        this.state = InstallWizardModal.initialState(Steps.length);
    }

    static propTypes = {
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired
    };

    static ACTIVE_STATE = 'active';
    static COMPLETED_STATE = 'completed';
    static DISABLED_STATE = 'disabled';

    static initialState = (numberOfSteps) => {
        const activeStep = 0;

        let steps = [];
        for (let i = 0; i < numberOfSteps; i++) {
            steps[i] = new Object({state: InstallWizardModal.DISABLED_STATE});
        }
        steps[activeStep].state = InstallWizardModal.ACTIVE_STATE;

        return {
            activeStep,
            steps
        };
    };

    onNext() {
        let steps = this.state.steps;
        steps[this.state.activeStep].state = InstallWizardModal.COMPLETED_STATE;
        steps[this.state.activeStep + 1].state = InstallWizardModal.ACTIVE_STATE;

        this.setState({
            activeStep: this.state.activeStep + 1,
            steps
        });
    }

    onPrev() {
        let steps = this.state.steps;
        steps[this.state.activeStep].state = InstallWizardModal.DISABLED_STATE;
        steps[this.state.activeStep - 1].state = InstallWizardModal.ACTIVE_STATE;

        this.setState({
            activeStep: this.state.activeStep - 1,
            steps
        });
    }

    render() {
        let {Button, Modal, Step} = Stage.Basic;
        let isLastStep = this.state.activeStep < this.steps.length - 1;

        return (
            <Modal open={this.props.open}
                   onClose={()=>this.props.onClose()} className='installWizardModal'>
                <Modal.Header>
                    Install Wizard
                </Modal.Header>

                <Modal.Description>
                    <Step.Group ordered fluid widths={this.steps.length}>
                        {
                            _.map(this.steps, (step, index) =>
                                <Step active={this.state.steps[index].state === InstallWizardModal.ACTIVE_STATE}
                                      completed={this.state.steps[index].state === InstallWizardModal.COMPLETED_STATE}
                                      disabled={this.state.steps[index].state === InstallWizardModal.DISABLED_STATE}
                                      key={step.title} >
                                    <Step.Content>
                                        <Step.Title>{step.title}</Step.Title>
                                        <Step.Description>{step.description}</Step.Description>
                                    </Step.Content>
                                </Step>
                            )
                        }
                    </Step.Group>
                </Modal.Description>

                <Modal.Content>
                    {this.steps[this.state.activeStep].content}
                </Modal.Content>

                <Modal.Actions>
                    <Button icon='arrow left' content='Back'
                            labelPosition='left' disabled={this.state.activeStep <= 0}
                            onClick={this.onPrev.bind(this)} />
                    <Button icon={isLastStep ? 'arrow right' : 'download'} content={isLastStep ? 'Next' : 'Install'}
                            labelPosition='right' disabled={this.state.activeStep > this.steps.length - 1}
                            onClick={this.onNext.bind(this)} />
                </Modal.Actions>
            </Modal>
        );
    }
}
