/**
 * Created by pposel on 18/01/2017.
 */

class UpdateDeploymentModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = UpdateDeploymentModal.initialState(props);
    }

    static initialState = props => ({
        loading: false,
        errors: {},
        yamlFile: null,
        fileLoading: false,
        blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT,
        deploymentInputs: { ...props.deployment.inputs },
        installWorkflow: true,
        uninstallWorkflow: true,
        installWorkflowFirst: false,
        ignoreFailure: false,
        automaticReinstall: true,
        reinstallList: [],
        showPreview: false,
        previewData: {},
        force: false
    });

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        deployment: PropTypes.object.isRequired,
        onHide: PropTypes.func.isRequired
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState(UpdateDeploymentModal.initialState(this.props));
            this.selectBlueprint(this.props.deployment.blueprint_id);
        }
    }

    onUpdate() {
        this.setState({ errors: {}, loading: true, showPreview: false }, () => this.submitUpdate(false));
        return false;
    }

    onPreview() {
        this.setState({ errors: {}, loading: true, showPreview: false }, () => this.submitUpdate(true));
        return true;
    }

    onCancel() {
        this.props.onHide();
        return true;
    }

    submitUpdate(preview) {
        const { InputsUtils } = Stage.Common;
        const errors = {};

        if (_.isEmpty(this.state.blueprint.id)) {
            errors.blueprintName = 'Please select blueprint';
        }

        const inputsWithoutValue = {};
        const inputsPlanForUpdate = InputsUtils.getPlanForUpdate(
            this.state.blueprint.plan.inputs,
            this.props.deployment.inputs
        );
        const deploymentInputs = InputsUtils.getInputsToSend(
            inputsPlanForUpdate,
            this.state.deploymentInputs,
            inputsWithoutValue
        );
        InputsUtils.addErrors(inputsWithoutValue, errors);

        if (!_.isEmpty(errors)) {
            this.setState({ errors, loading: false });
            return false;
        }

        const actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions
            .doUpdate(
                this.props.deployment.id,
                this.state.blueprint.id,
                deploymentInputs,
                this.state.installWorkflow,
                this.state.uninstallWorkflow,
                this.state.installWorkflowFirst,
                this.state.ignoreFailure,
                this.state.automaticReinstall,
                this.state.reinstallList,
                this.state.force,
                preview
            )
            .then(data => {
                if (preview) {
                    this.setState({ errors: {}, loading: false, showPreview: true, previewData: data });
                } else {
                    this.setState({ errors: {}, loading: false });
                    this.props.toolbox.refresh();
                    this.props.onHide();
                    this.props.toolbox.getEventBus().trigger('nodes:refresh');
                    this.props.toolbox.getEventBus().trigger('inputs:refresh');
                    this.props.toolbox.getEventBus().trigger('outputs:refresh');
                    this.props.toolbox.getEventBus().trigger('executions:refresh');
                }
            })
            .catch(err => {
                const errors = InputsUtils.getErrorObject(err.message);
                this.setState({ loading: false, errors });
            });
    }

    handleInputChange(proxy, field) {
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState(fieldNameValue);
    }

    handleDeploymentInputChange(proxy, field) {
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState({ deploymentInputs: { ...this.state.deploymentInputs, ...fieldNameValue } });
    }

    handleYamlFileChange(file) {
        if (!file) {
            return;
        }

        const { FileActions, InputsUtils } = Stage.Common;
        const actions = new FileActions(this.props.toolbox);
        this.setState({ fileLoading: true });

        actions
            .doGetYamlFileContent(file)
            .then(yamlInputs => {
                const deploymentInputs = InputsUtils.getUpdatedInputs(
                    this.state.blueprint.plan.inputs,
                    this.state.deploymentInputs,
                    yamlInputs
                );
                this.setState({ errors: {}, deploymentInputs, fileLoading: false });
            })
            .catch(err => {
                const errorMessage = `Loading values from YAML file failed: ${_.isString(err) ? err : err.message}`;
                this.setState({ errors: { yamlFile: errorMessage }, fileLoading: false });
            });
    }

    selectBlueprint(id) {
        if (!_.isEmpty(id)) {
            this.setState({ loading: true });

            const actions = new Stage.Common.BlueprintActions(this.props.toolbox);
            actions
                .doGetFullBlueprintData({ id })
                .then(blueprint => {
                    const deploymentInputs = {};
                    const currentDeploymentInputs = this.props.deployment.inputs;

                    _.forEach(blueprint.plan.inputs, (inputObj, inputName) => {
                        deploymentInputs[inputName] = Stage.Common.InputsUtils.getInputFieldInitialValue(
                            currentDeploymentInputs[inputName],
                            inputObj.type,
                            blueprint.plan.data_types
                        );
                    });

                    this.setState({ deploymentInputs, blueprint, errors: {}, loading: false });
                })
                .catch(err => {
                    this.setState({
                        blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT,
                        loading: false,
                        errors: { error: err.message }
                    });
                });
        } else {
            this.setState({ blueprint: Stage.Common.DeployBlueprintModal.EMPTY_BLUEPRINT, errors: {} });
        }
    }

    render() {
        const { ApproveButton, CancelButton, Form, Header, Icon, Message, Modal } = Stage.Basic;
        const {
            DataTypesButton,
            DynamicDropdown,
            InputsHeader,
            InputsUtils,
            NodeInstancesFilter,
            YamlFileButton,
            UpdateDetailsModal
        } = Stage.Common;

        const executionParameters = this.state.showPreview
            ? {
                  skip_install: !this.state.installWorkflow,
                  skip_uninstall: !this.state.uninstallWorkflow,
                  skip_reinstall: !this.state.automaticReinstall,
                  reinstall_list: this.state.reinstallList
              }
            : {};

        return (
            <Modal
                open={this.props.open}
                onClose={() => this.props.onHide()}
                closeOnEscape={false}
                className="updateDeploymentModal"
            >
                <Modal.Header>
                    <Icon name="edit" /> Update deployment {this.props.deployment.id}
                </Modal.Header>

                <Modal.Content>
                    <Form
                        loading={this.state.loading}
                        errors={this.state.errors}
                        scrollToError
                        onErrorsDismiss={() => this.setState({ errors: {} })}
                    >
                        <Form.Field error={this.state.errors.blueprintName} label="Blueprint" required>
                            <DynamicDropdown
                                value={this.state.blueprint.id}
                                placeholder="Select Blueprint"
                                name="blueprintName"
                                fetchUrl="/blueprints?_include=id"
                                onChange={this.selectBlueprint.bind(this)}
                                toolbox={this.props.toolbox}
                            />
                        </Form.Field>

                        {this.state.blueprint.id && (
                            <>
                                {!_.isEmpty(this.state.blueprint.plan.inputs) && (
                                    <YamlFileButton
                                        onChange={this.handleYamlFileChange.bind(this)}
                                        dataType="deployment's inputs"
                                        fileLoading={this.state.fileLoading}
                                    />
                                )}
                                {!_.isEmpty(this.state.blueprint.plan.data_types) && (
                                    <DataTypesButton types={this.state.blueprint.plan.data_types} />
                                )}
                                <InputsHeader />
                                {_.isEmpty(this.state.blueprint.plan.inputs) && (
                                    <Message content="No inputs available for the selected blueprint" />
                                )}
                            </>
                        )}

                        {InputsUtils.getInputFields(
                            this.state.blueprint.plan.inputs,
                            this.handleDeploymentInputChange.bind(this),
                            this.state.deploymentInputs,
                            this.state.errors,
                            this.state.blueprint.plan.data_types
                        )}

                        <Form.Divider>
                            <Header size="tiny">Actions</Header>
                        </Form.Divider>

                        <Form.Field>
                            <Form.Checkbox
                                label="Run install workflow"
                                toggle
                                name="installWorkflow"
                                help="Run install lifecycle operations"
                                checked={this.state.installWorkflow}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox
                                label="Run uninstall workflow"
                                toggle
                                name="uninstallWorkflow"
                                help="Run uninstall lifecycle operations"
                                checked={this.state.uninstallWorkflow}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox
                                label="Run install workflow first"
                                help="Run install workflow first and then uninstall workflow.
                                                 Default: first uninstall and then install"
                                toggle
                                name="installWorkflowFirst"
                                checked={this.state.installWorkflowFirst}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox
                                label="Ignore failures in uninstall workflow"
                                toggle
                                name="ignoreFailure"
                                help="Supply the parameter `ignore_failure` with
                                                 the value `true` to the uninstall workflow"
                                checked={this.state.ignoreFailure}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox
                                label="Run automatic reinstall"
                                name="automaticReinstall"
                                toggle
                                help='Automatically reinstall node instances
                                                 that their properties has been modified, as
                                                 part of a deployment update. If not set, then node instances
                                                 that were explicitly given to "Reinstall
                                                 node instances list" will still be reinstalled'
                                checked={this.state.automaticReinstall}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <NodeInstancesFilter
                            name="reinstallList"
                            deploymentId={this.props.deployment.id}
                            label="Reinstall node instances list"
                            value={this.state.reinstallList}
                            placeholder="Choose node instances to reinstall"
                            upward
                            onChange={this.handleInputChange.bind(this)}
                            help='Node instances ids to be reinstalled as part
                                                   of deployment update. They will be
                                                   reinstalled even if "Run automatic reinstall"
                                                   is not set'
                            toolbox={this.props.toolbox}
                        />

                        <Form.Field>
                            <Form.Checkbox
                                label="Force update"
                                name="force"
                                toggle
                                help="Force running update in case a previous
                                                 update on this deployment has failed to
                                                 finished successfully"
                                checked={this.state.force}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>

                    <UpdateDetailsModal
                        open={this.state.showPreview}
                        isPreview
                        deploymentUpdate={this.state.previewData}
                        executionParameters={executionParameters}
                        onClose={() => this.setState({ showPreview: false })}
                        onUpdate={this.onUpdate.bind(this)}
                        toolbox={this.props.toolbox}
                    />
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton
                        onClick={this.onPreview.bind(this)}
                        disabled={this.state.loading}
                        content="Preview"
                        icon="zoom"
                        color="blue"
                    />
                    <ApproveButton
                        onClick={this.onUpdate.bind(this)}
                        disabled={this.state.loading}
                        content="Update"
                        icon="edit"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

Stage.defineCommon({
    name: 'UpdateDeploymentModal',
    common: UpdateDeploymentModal
});
