/**
 * Created by jakub.niezgoda on 20/07/2018.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {ErrorMessage, Confirm, Modal, Step} from './../index';
import '../../styles/Wizard.css';

/**
 * WizardModal component allows you to present step-by-step process in modal window providing convenient way
 * to navigate between steps and store step's data during the process.
 *
 * Steps have to be constructed using {@link createWizardStep} function.
 *
 * ## Access
 * `Stage.Basic.Wizard.Modal`
 *
 * ## Usage
 *
 * ![WizardModal](manual/asset/wizard/WizardModal_0.png)
 * ```
 * const wizardTitle = 'Hello World Wizard';
 * const helloWorldWizardSteps = [
 *     InfrastructureStep, PluginsStep, SecretsStep, InputsStep, ConfirmationStep, InstallStep
 * ];
 *
 * <Wizard.Modal header={wizardTitle} open={this.state.open} steps={helloWorldWizardSteps}
 *               onClose={this.closeWizard.bind(this)} toolbox={toolbox} />
 *```
 */
export default class WizardModal extends Component {

    constructor(props) {
        super(props);

        this.state = WizardModal.initialState(props.steps);
    }

    /**
     * @property {boolean} open Controls whether or not the wizard modal is displayed
     * @property {function(event: SyntheticEvent, data: object)} onClose Function called when wizard is to be closed
     * @property {object[]} steps List of objects describing the steps (@see wizardUtils.createWizardStep function for details)
     * @property {object} toolbox Toolbox object
     */
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

    /**
     * Active step state
     */
    static ACTIVE_STATE = 'active';
    /**
     * Completed step state
     */
    static COMPLETED_STATE = 'completed';
    /**
     * Disabled step state
     */
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

    /**
     * @param {string} id step ID
     * @return {string} step name used in wizard state
     */
    static getStepNameById(id) {
        return `${id}Step`;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.open, nextProps.open) || !_.isEqual(this.state, nextState);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.open && !this.props.open) { // reset wizard on close
            this.setState({...WizardModal.initialState(this.props.steps)});
        }
    }

    /**
     * @param {string} index step index in steps list
     * @return {string} step name used in wizard state
     */
    getStepNameByIndex(index) {
        return WizardModal.getStepNameById(this.props.steps[index].id);
    }

    showCloseModal() {
        this.setState({showCloseModal: true});
    }

    hideCloseModal() {
        this.setState({showCloseModal: false});
    }

    /**
     * Function called on click on Start Over action button. Changes WizardModal state.
     *
     * @param {boolean} resetData If set to true, then wizard data will be reset
     */
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

    /**
     * Function called on click on Next action button. Changes WizardModal state by merging stepOutputData with wizardData
     * changing state of current step to WizardModal.COMPLETED_STATE and incrementing index of active step.
     *
     * @param {string} id step ID
     * @param {object} [stepOutputData] object with step data to be merged into wizardData
     */
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

    /**
     * Function called on click on Back action button. Changes WizardModal state by merging stepOutputData with wizardData
     * changing state of current step to WizardModal.COMPLETED_STATE and decrementing index of active step.
     *
     * @param {string} id step ID
     * @param {object} [stepOutputData] object with step data to be merged into wizardData
     */
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

    /**
     * Function called to show error in wizard. Changes WizardModal state to show error message and/or errors in the form
     *
     * @param {string} id step ID
     * @param {string} errorMessage error message to be shown in wizard
     * @param {object} [errors=undefined] object with errors used to mark fields in form as 'containing errors'
     */
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

    /**
     * Function called to turn on loading state
     */
    onLoading() {
        return new Promise((resolve) => this.setState({loading: true}, resolve));
    }

    /**
     * Function called to turn off loading state
     */
    onReady() {
        return new Promise((resolve) => this.setState({loading: false}, resolve));
    }

    /**
     * Function called on step content update to update wizard state - either stepData or wizardData
     *
     * @param {string} id step ID
     * @param {string} data object with step data
     * @param {object} [internal=true] If true then data is treated as step internal data, if false, then as wizard global data
     */
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

    /**
     * Function called to provide current step data from wizard
     *
     * @param {string} id step ID
     * @return {Promise<{stepData: object}, error>} Promise containing step data object
     */
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
        const className = `wizardModal ${activeStepName}`;

        return (
            <Modal open={this.props.open} onClose={this.props.onClose} className={className}
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

                <Modal.Content>
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
