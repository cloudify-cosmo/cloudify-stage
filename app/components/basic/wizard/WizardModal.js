/**
 * Created by jakub.niezgoda on 20/07/2018.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {ErrorMessage, Form, Modal, Step} from './../index';
import '../../styles/Wizard.css';

export default class WizardModal extends Component {

    constructor(props) {
        super(props);

        this.state = WizardModal.initialState(props.steps);
    }

    static propTypes = {
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        steps: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            Content: PropTypes.func.isRequired,
            Actions: PropTypes.func.isRequired
        })).isRequired,
        toolbox: PropTypes.object.isRequired
    };

    static ACTIVE_STATE = 'active';
    static COMPLETED_STATE = 'completed';
    static DISABLED_STATE = 'disabled';

    static initialState = (steps) => {
        const activeStepIndex = 0;
        const previousStepIndex = -1;

        let stepsList = [];
        let stepsObject = {};
        for (let step of steps) {
            const stepName = WizardModal.getStepNameById(step.id);
            stepsList.push(stepName);
            stepsObject[stepName] = {state: WizardModal.DISABLED_STATE, data: {}};
        }
        stepsObject[stepsList[activeStepIndex]].state = WizardModal.ACTIVE_STATE;

        return {
            activeStepIndex: activeStepIndex,
            previousStepIndex: previousStepIndex,
            steps: stepsList,
            ...stepsObject,
            wizardData: {},
            loading: false,
            error: null
        };
    };

    static getStepNameById(id) {
        return `${id}Step`;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.open, nextProps.open) || !_.isEqual(this.state, nextState);
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (!this.props.open && nextProps.open) {
            this.setState({...WizardModal.initialState(nextProps.steps)});
        }
    }

    getStepNameByIndex(index) {
        return WizardModal.getStepNameById(this.props.steps[index].id);
    }

    onNext(id, stepOutputData) {
        if (this.getStepNameByIndex(this.state.activeStepIndex) !== WizardModal.getStepNameById(id)) {
            return;
        }

        const activeStepIndex = this.state.activeStepIndex + 1;
        const previousStepIndex = this.state.activeStepIndex;

        const activeStepName = this.getStepNameByIndex(activeStepIndex);
        const previousStepName = this.getStepNameByIndex(previousStepIndex);

        const wizardData = {...this.state.wizardData, ...stepOutputData};

        this.setState({
            activeStepIndex,
            previousStepIndex,
            [activeStepName]: {...this.state[activeStepName], state: WizardModal.ACTIVE_STATE},
            [previousStepName]: {...this.state[previousStepName], state: WizardModal.COMPLETED_STATE},
            wizardData,
            error: null,
            loading: false
        });
    }

    onPrev(id, stepOutputData) {
        if (this.getStepNameByIndex(this.state.activeStepIndex) !== WizardModal.getStepNameById(id)) {
            return;
        }

        const activeStepIndex = this.state.activeStepIndex - 1;
        const previousStepIndex = this.state.activeStepIndex;

        const activeStepName = this.getStepNameByIndex(activeStepIndex);
        const previousStepName = this.getStepNameByIndex(previousStepIndex);

        const wizardData = {...this.state.wizardData, ...stepOutputData};

        this.setState({
            activeStepIndex,
            previousStepIndex,
            [activeStepName]: {...this.state[activeStepName], state: WizardModal.ACTIVE_STATE},
            [previousStepName]: {...this.state[previousStepName], state: WizardModal.DISABLED_STATE},
            wizardData,
            error: null
        });
    }

    onError(id, message) {
        this.setState({error: message});
    }

    onLoading(id) {
        return new Promise((resolve) => this.setState({loading: true}, resolve));
    }

    onReady(id) {
        return new Promise((resolve) => this.setState({loading: false}, resolve));
    }

    onStepClick(event, {id, active, disabled, completed}) {
        // TODO: Implement step change handling
    }

    onStepDataChanged(id, stepData) {
        const stepName = WizardModal.getStepNameById(id);
        const stepState = this.state[stepName];

        this.setState({[stepName]: {...stepState, data: stepData}});
    }

    fetchStepData(id) {
        const stepName = WizardModal.getStepNameById(id);
        const stepState = this.state[stepName];
        const wizardData = this.state.wizardData;

        return Promise.resolve({stepData: stepState.data, wizardData: wizardData});
    }

    render() {
        const steps = this.props.steps;
        let ActiveStep = steps[this.state.activeStepIndex];
        let activeStepName = this.getStepNameByIndex(this.state.activeStepIndex);
        let stepData = this.state[activeStepName].data;

        return (
            <Modal open={this.props.open} onClose={this.props.onClose} className='wizardModal'
                   closeIcon={true} closeOnEscape={false} closeOnDimmerClick={false}>
                <Modal.Header>
                    {this.props.header}
                </Modal.Header>

                <Modal.Description>
                    <Step.Group ordered fluid widths={steps.length}>
                        {
                            _.map(steps, (step, index) =>
                                <Step active={this.state[this.getStepNameByIndex(index)].state === WizardModal.ACTIVE_STATE}
                                      completed={this.state[this.getStepNameByIndex(index)].state === WizardModal.COMPLETED_STATE}
                                      disabled={this.state[this.getStepNameByIndex(index)].state === WizardModal.DISABLED_STATE}
                                      onClick={this.onStepClick.bind(this)}
                                      id={step.id} key={step.id}>
                                    <Step.Content>
                                        <Step.Title>{step.title}</Step.Title>
                                        <Step.Description>{step.description}</Step.Description>
                                    </Step.Content>
                                </Step>
                            )
                        }
                    </Step.Group>
                    {this.state.error && <ErrorMessage error={this.state.error} />}
                </Modal.Description>

                <Modal.Content scrolling>
                    <Form loading={this.state.loading}>
                        <ActiveStep.Content stepData={stepData}
                                            wizardData={this.state.wizardData}
                                            onLoading={this.onLoading.bind(this)}
                                            onReady={this.onReady.bind(this)}
                                            onError={this.onError.bind(this)}
                                            onChange={this.onStepDataChanged.bind(this)}
                                            toolbox={this.props.toolbox} />
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <ActiveStep.Actions onPrev={this.onPrev.bind(this)}
                                        onNext={this.onNext.bind(this)}
                                        onError={this.onError.bind(this)}
                                        onLoading={this.onLoading.bind(this)}
                                        onReady={this.onReady.bind(this)}
                                        disabled={this.state.loading}
                                        showPrev={this.state.activeStepIndex !== 0}
                                        fetchData={this.fetchStepData.bind(this, ActiveStep.id)}
                                        toolbox={this.props.toolbox} />
                </Modal.Actions>
            </Modal>
        );
    }
}
