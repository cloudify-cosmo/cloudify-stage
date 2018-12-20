/**
 * Created by kinneretzin on 19/10/2016.
 */

import PropTypes from 'prop-types';
import React from 'react';

export default class ExecuteDeploymentModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = ExecuteDeploymentModal.initialState;
    }

    static initialState = {
        errors: {},
        loading: false,
        dryRun: false,
        fileLoading: false,
        force: false,
        queue: false,
        schedule: false,
        scheduledTime: '',
        params: {}
    };

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        deployment: PropTypes.object.isRequired,
        deployments: PropTypes.array,
        workflow: PropTypes.object.isRequired,
        onHide: PropTypes.func.isRequired
    };

    static defaultProps = {
        deployments: []
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            let {InputsUtils} = Stage.Common;
            let params = _.mapValues(
                _.get(this.props.workflow, 'parameters', {}), (parameterData) =>
                    InputsUtils.getInputFieldInitialValue(parameterData.default, parameterData.type));
            this.setState({...ExecuteDeploymentModal.initialState, params});
        }
    }

    onApprove () {
        this._submitExecute();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    _submitExecute () {
        const {InputsUtils, DeploymentActions} = Stage.Common;
        let errors = {};

        if (!this.props.deployment || !this.props.workflow) {
            this.setState({errors: {error: 'Missing workflow or deployment'}});
            return false;
        }

        let inputsWithoutValue = {};
        const workflowParameters = InputsUtils.getInputsToSend(this.props.workflow.parameters,
                                                               this.state.params,
                                                               inputsWithoutValue);
        InputsUtils.addErrors(inputsWithoutValue, errors);

        if (this.state.schedule) {
            const scheduledTimeMoment = moment(this.state.scheduledTime);
            if (!scheduledTimeMoment.isValid() ||
                !_.isEqual(scheduledTimeMoment.format('YYYY-MM-DD HH:mm'), this.state.scheduledTime)) {
                errors.scheduledTime = 'Please provide valid scheduled time';
            }
        }

        if (!_.isEmpty(errors)){
            this.setState({errors: errors});
            return false;
        }

        this.setState({loading: true});
        const actions = new DeploymentActions(this.props.toolbox);

        let deployments = this.props.deployments;
        if (_.isEmpty(deployments)) {
            deployments = [this.props.deployment.id];

        }

        let executePromises = _.map(deployments, (deploymentId) => {
            const scheduledTime = this.state.schedule
                ? moment(this.state.scheduledTime).format('YYYYMMDDHHmmZ')
                : undefined;
            return actions.doExecute({id: deploymentId}, this.props.workflow, workflowParameters,
                this.state.force, this.state.dryRun, this.state.queue, scheduledTime).then(()=>{
                this.setState({loading: false, errors: {}});
                this.props.onHide();
                this.props.toolbox.getEventBus().trigger('executions:refresh');
                this.props.toolbox.getEventBus().trigger('deployments:refresh');
            })
        });

        return Promise.all(executePromises)
            .catch((err)=>{
                this.setState({loading: false, errors: {error: err.message}});
            });

    }

    handleYamlFileChange(file) {
        if (!file) {
            return;
        }

        let {FileActions, InputsUtils} = Stage.Common;
        let actions = new FileActions(this.props.toolbox);
        this.setState({fileLoading: true});

        actions.doGetYamlFileContent(file).then((yamlInputs) => {
            let params = InputsUtils.getUpdatedInputs(this.props.workflow.parameters, this.state.params, yamlInputs);
            this.setState({errors: {}, params, fileLoading: false});
        }).catch((err) => {
            const errorMessage = `Loading values from YAML file failed: ${_.isString(err) ? err : err.message}`;
            this.setState({errors: {yamlFile: errorMessage}, fileLoading: false});
        });
    }

    handleInputChange(event, field) {
        this.setState({params: {...this.state.params, ...Stage.Basic.Form.fieldNameValue(field)}});
    }

    render() {
        let {ApproveButton, CancelButton, Divider, Form, Header, Icon, Modal, Message, TimePicker} = Stage.Basic;
        let {InputsHeader, InputsUtils, YamlFileButton} = Stage.Common;

        const workflow = Object.assign({},{name:'', parameters:[]}, this.props.workflow);
        const deployment = Object.assign({},{id:''}, this.props.deployment);
        const deploymentName = !_.isEmpty(this.props.deployments)
            ? _.size(this.props.deployments) > 1 ? 'multiple deployments' : this.props.deployments[0]
            : deployment.id;

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()} className="executeWorkflowModal">
                <Modal.Header>
                    <Icon name="road"/> Execute workflow {workflow.name} on {deploymentName}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>

                        {
                            !_.isEmpty(workflow.parameters) &&
                            <YamlFileButton onChange={this.handleYamlFileChange.bind(this)}
                                            dataType='execution parameters' fileLoading={this.state.fileLoading} />
                        }

                        <InputsHeader header="Parameters" compact />

                        {
                            _.isEmpty(workflow.parameters) &&
                            <Message content="No parameters available for the execution" />
                        }

                        {
                            InputsUtils.getInputFields(workflow.parameters,
                                                       this.handleInputChange.bind(this),
                                                       this.state.params,
                                                       this.state.errors)
                        }

                        <Form.Divider>
                            <Header size="tiny">
                                Actions
                            </Header>
                        </Form.Divider>

                        <Form.Field>
                            <Form.Checkbox name='force' toggle label='Force'
                                           help='Execute the workflow even if there is an ongoing
                                                 execution for the given deployment.
                                                 You cannot use this option with "Queue".'
                                           checked={this.state.force}
                                           onChange={(event, field) => this.setState({force: field.checked, queue: false, errors: {}})} />
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox name='dryRun' toggle label='Dry run'
                                           help='If set, no actual operations will be performed.
                                                 Executed tasks will be logged without side effects.
                                                 You cannot use this option with "Queue".'
                                           checked={this.state.dryRun}
                                           onChange={(event, field) => this.setState({dryRun: field.checked, queue: false, errors: {}})} />
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox name='queue' toggle label='Queue'
                                           help='If set, executions that can`t currently run will
                                                 be queued and run automatically when possible.
                                                 You cannot use this option with "Force" and "Dry run".'
                                           checked={this.state.queue}
                                           onChange={(event, field) => this.setState({queue: field.checked, force: false, dryRun: false, schedule: false, scheduledTime: '', errors: {}})} />
                        </Form.Field>

                        <Form.Field error={!!this.state.errors.scheduledTime}>
                            <Form.Checkbox name='schedule' toggle label='Schedule'
                                           help='If set, workflow will be executed at specific time (local timezone)
                                                 provided below. You cannot use this option with "Queue".'
                                           checked={this.state.schedule}
                                           onChange={(event, field) => this.setState({schedule: field.checked, queue: false, errors: {}})} />
                            {
                                this.state.schedule &&
                                <Divider hidden />
                            }
                            {
                                this.state.schedule &&
                                <TimePicker name='scheduledTime' value={this.state.scheduledTime} defaultValue=''
                                              minDate={moment()} maxDate={moment().add(1, 'Y')}
                                              onChange={(event, field) => this.setState({scheduledTime: field.value, queue: false, errors: {}})} />
                            }
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Execute" icon="rocket" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};

Stage.defineCommon({
    name: 'ExecuteDeploymentModal',
    common: ExecuteDeploymentModal
});