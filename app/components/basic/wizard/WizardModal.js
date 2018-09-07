/**
 * Created by jakub.niezgoda on 20/07/2018.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {ErrorMessage, Confirm, Modal, Step} from './../index';
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
            stepsObject[stepName] = {state: WizardModal.DISABLED_STATE, data: {}, errors: {}};
        }
        stepsObject[stepsList[activeStepIndex]].state = WizardModal.ACTIVE_STATE;

        return {
            activeStepIndex: activeStepIndex,
            previousStepIndex: previousStepIndex,
            steps: stepsList,
            ...stepsObject,
            wizardData: {},
            loading: false,
            error: null,
            showCloseModal: false
        };
    };

    static getStepNameById(id) {
        return `${id}Step`;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.open, nextProps.open) || !_.isEqual(this.state, nextState);
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState({...WizardModal.initialState(this.props.steps)});
        }
    }

    getStepNameByIndex(index) {
        return WizardModal.getStepNameById(this.props.steps[index].id);
    }

    showCloseModal() {
        this.setState({showCloseModal: true});
    }

    hideCloseModal() {
        this.setState({showCloseModal: false});
    }

    onStartOver(resetData) {
        if (resetData) {
            this.setState({...WizardModal.initialState(this.props.steps)});
        } else {
            const activeStepName = this.getStepNameByIndex(0);

            let stepsObject = {};
            for (let step of this.props.steps) {
                const stepName = WizardModal.getStepNameById(step.id);
                stepsObject[stepName] = {...this.state[stepName], state: WizardModal.DISABLED_STATE, errors: {}};
            }
            stepsObject[activeStepName].state = WizardModal.ACTIVE_STATE;

            this.setState({
                activeStepIndex: 0,
                previousStepIndex: this.state.activeStepIndex,
                ...stepsObject,
                error: null,
                loading: false
            });
        }
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

    onError(id, errorMessage, errors) {
        if (this.getStepNameByIndex(this.state.activeStepIndex) !== WizardModal.getStepNameById(id)) {
            return;
        }

        if (!_.isNil(errors)) {
            const stepName = WizardModal.getStepNameById(id);
            const stepState = this.state[stepName];

            return new Promise((resolve) => this.setState({[stepName]: {...stepState, errors}, error: errorMessage, loading: false}, resolve));
        } else {
            return new Promise((resolve) => this.setState({error: errorMessage, loading: false}, resolve));
        }
    }

    onLoading() {
        return new Promise((resolve) => this.setState({loading: true}, resolve));
    }

    onReady() {
        return new Promise((resolve) => this.setState({loading: false}, resolve));
    }

    onStepDataChanged(id, data, internal = true) {
        if (internal) { // internal step data => state[stepId]
            const stepName = WizardModal.getStepNameById(id);
            const stepState = this.state[stepName];

            this.setState({[stepName]: {...stepState, data: data, errors: {}}, error: null});
        } else { // step output data => state.wizardData
            const wizardData = {...this.state.wizardData, ...data};

            this.setState({wizardData});
        }
    }

    fetchStepData(id) {
        const stepName = WizardModal.getStepNameById(id);
        const stepState = this.state[stepName];

        return Promise.resolve({stepData: stepState.data});
    }

    render() {
        const steps = this.props.steps;
        let ActiveStep = steps[this.state.activeStepIndex];
        const activeStepName = this.getStepNameByIndex(this.state.activeStepIndex);
        const activeStepObject = this.state[activeStepName];

        return (
            <Modal open={this.props.open} onClose={this.props.onClose} className='wizardModal'
                   closeIcon={false} closeOnEscape={false} closeOnDimmerClick={false}>
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
                                      id={step.id} key={step.id}>
                                    <Step.Content>
                                        <Step.Title>{step.title}</Step.Title>
                                        <Step.Description>{step.description}</Step.Description>
                                    </Step.Content>
                                </Step>
                            )
                        }
                    </Step.Group>

                    <ErrorMessage error={this.state.error} onDismiss={() => this.setState({[activeStepName]: {...activeStepObject, errors: {}}, error: null})} autoHide />
                </Modal.Description>

                <Modal.Content scrolling>
                    <ActiveStep.Content stepData={activeStepObject.data}
                                        wizardData={this.state.wizardData}
                                        onLoading={this.onLoading.bind(this)}
                                        onReady={this.onReady.bind(this)}
                                        onError={this.onError.bind(this)}
                                        onChange={this.onStepDataChanged.bind(this)}
                                        errors={activeStepObject.errors}
                                        loading={this.state.loading}
                                        toolbox={this.props.toolbox} />
                </Modal.Content>

                <Modal.Actions>
                    <ActiveStep.Actions onClose={this.showCloseModal.bind(this)}
                                        onStartOver={this.onStartOver.bind(this)}
                                        onPrev={this.onPrev.bind(this)}
                                        onNext={this.onNext.bind(this)}
                                        onError={this.onError.bind(this)}
                                        onLoading={this.onLoading.bind(this)}
                                        onReady={this.onReady.bind(this)}
                                        disabled={this.state.loading}
                                        showPrev={this.state.activeStepIndex !== 0}
                                        fetchData={this.fetchStepData.bind(this, ActiveStep.id)}
                                        wizardData={this.state.wizardData}
                                        toolbox={this.props.toolbox} />

                    <Confirm content='Are you sure you want to close the wizard?'
                             open={this.state.showCloseModal}
                             onConfirm={this.props.onClose}
                             onCancel={this.hideCloseModal.bind(this)} />
                </Modal.Actions>
            </Modal>
        );
    }
}
