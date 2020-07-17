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
        toolbox: Stage.Common.PropTypes.Toolbox.isRequired,
        open: PropTypes.bool.isRequired,
        deployment: PropTypes.shape({
            blueprint_id: PropTypes.string,
            id: PropTypes.string,
            inputs: PropTypes.shape({})
        }).isRequired,
        onHide: PropTypes.func.isRequired
    };

    componentDidUpdate(prevProps) {
        const { deployment, open } = this.props;
        if (!prevProps.open && open) {
            this.setState(UpdateDeploymentModal.initialState(this.props));
            this.selectBlueprint(deployment.blueprint_id);
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
        const { onHide } = this.props;
        onHide();
        return true;
    }

    submitUpdate(preview) {
        const {
            automaticReinstall,
            blueprint,
            deploymentInputs: deploymentInputsState,
            force,
            ignoreFailure,
            installWorkflow,
            installWorkflowFirst,
            reinstallList,
            uninstallWorkflow
        } = this.state;
        const { deployment, onHide, toolbox } = this.props;
        const { InputsUtils } = Stage.Common;
        const errors = {};

        if (_.isEmpty(blueprint.id)) {
            errors.blueprintName = 'Please select blueprint';
        }

        const inputsWithoutValue = {};
        const inputsPlanForUpdate = InputsUtils.getPlanForUpdate(blueprint.plan.inputs, deployment.inputs);
        const deploymentInputs = InputsUtils.getInputsToSend(
            inputsPlanForUpdate,
            deploymentInputsState,
            inputsWithoutValue
        );
        InputsUtils.addErrors(inputsWithoutValue, errors);

        if (!_.isEmpty(errors)) {
            this.setState({ errors, loading: false });
            return false;
        }

        const actions = new Stage.Common.DeploymentActions(toolbox);
        actions
            .doUpdate(
                deployment.id,
                blueprint.id,
                deploymentInputs,
                installWorkflow,
                uninstallWorkflow,
                installWorkflowFirst,
                ignoreFailure,
                automaticReinstall,
                reinstallList,
                force,
                preview
            )
            .then(data => {
                if (preview) {
                    this.setState({ errors: {}, loading: false, showPreview: true, previewData: data });
                } else {
                    this.setState({ errors: {}, loading: false });
                    toolbox.refresh();
                    onHide();
                    toolbox.getEventBus().trigger('nodes:refresh');
                    toolbox.getEventBus().trigger('inputs:refresh');
                    toolbox.getEventBus().trigger('outputs:refresh');
                    toolbox.getEventBus().trigger('executions:refresh');
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
        const { deploymentInputs } = this.state;
        const fieldNameValue = Stage.Basic.Form.fieldNameValue(field);
        this.setState({ deploymentInputs: { ...deploymentInputs, ...fieldNameValue } });
    }

    handleYamlFileChange(file) {
        const { blueprint, deploymentInputs: deploymentInputsState } = this.state;
        if (!file) {
            return;
        }

        const { FileActions, InputsUtils } = Stage.Common;
        const { toolbox } = this.props;
        const actions = new FileActions(toolbox);
        this.setState({ fileLoading: true });

        actions
            .doGetYamlFileContent(file)
            .then(yamlInputs => {
                const deploymentInputs = InputsUtils.getUpdatedInputs(
                    blueprint.plan.inputs,
                    deploymentInputsState,
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
        const { deployment, toolbox } = this.props;
        if (!_.isEmpty(id)) {
            this.setState({ loading: true });

            const actions = new Stage.Common.BlueprintActions(toolbox);
            actions
                .doGetFullBlueprintData({ id })
                .then(blueprint => {
                    const deploymentInputs = {};
                    const currentDeploymentInputs = deployment.inputs;

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
        const {
            automaticReinstall,
            blueprint,
            deploymentInputs,
            errors,
            fileLoading,
            force,
            ignoreFailure,
            installWorkflow,
            installWorkflowFirst,
            loading,
            previewData,
            reinstallList,
            showPreview,
            uninstallWorkflow
        } = this.state;
        const { deployment, onHide, open, toolbox } = this.props;
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

        const executionParameters = showPreview
            ? {
                  skip_install: !installWorkflow,
                  skip_uninstall: !uninstallWorkflow,
                  skip_reinstall: !automaticReinstall,
                  reinstall_list: reinstallList
              }
            : {};

        return (
            <Modal open={open} onClose={() => onHide()} className="updateDeploymentModal">
                <Modal.Header>
                    <Icon name="edit" /> Update deployment {deployment.id}
                </Modal.Header>

                <Modal.Content>
                    <Form
                        loading={loading}
                        errors={errors}
                        scrollToError
                        onErrorsDismiss={() => this.setState({ errors: {} })}
                    >
                        <Form.Field error={errors.blueprintName} label="Blueprint" required>
                            <DynamicDropdown
                                value={blueprint.id}
                                placeholder="Select Blueprint"
                                name="blueprintName"
                                fetchUrl="/blueprints?_include=id"
                                onChange={this.selectBlueprint.bind(this)}
                                toolbox={toolbox}
                            />
                        </Form.Field>

                        {blueprint.id && (
                            <>
                                {!_.isEmpty(blueprint.plan.inputs) && (
                                    <YamlFileButton
                                        onChange={this.handleYamlFileChange.bind(this)}
                                        dataType="deployment's inputs"
                                        fileLoading={fileLoading}
                                    />
                                )}
                                {!_.isEmpty(blueprint.plan.data_types) && (
                                    <DataTypesButton types={blueprint.plan.data_types} />
                                )}
                                <InputsHeader />
                                {_.isEmpty(blueprint.plan.inputs) && (
                                    <Message content="No inputs available for the selected blueprint" />
                                )}
                            </>
                        )}

                        {InputsUtils.getInputFields(
                            blueprint.plan.inputs,
                            this.handleDeploymentInputChange.bind(this),
                            deploymentInputs,
                            errors,
                            blueprint.plan.data_types
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
                                checked={installWorkflow}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field>
                            <Form.Checkbox
                                label="Run uninstall workflow"
                                toggle
                                name="uninstallWorkflow"
                                help="Run uninstall lifecycle operations"
                                checked={uninstallWorkflow}
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
                                checked={installWorkflowFirst}
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
                                checked={ignoreFailure}
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
                                checked={automaticReinstall}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <NodeInstancesFilter
                            name="reinstallList"
                            deploymentId={deployment.id}
                            label="Reinstall node instances list"
                            value={reinstallList}
                            placeholder="Choose node instances to reinstall"
                            upward
                            onChange={this.handleInputChange.bind(this)}
                            help='Node instances ids to be reinstalled as part
                                                   of deployment update. They will be
                                                   reinstalled even if "Run automatic reinstall"
                                                   is not set'
                            toolbox={toolbox}
                        />

                        <Form.Field>
                            <Form.Checkbox
                                label="Force update"
                                name="force"
                                toggle
                                help="Force running update in case a previous
                                                 update on this deployment has failed to
                                                 finished successfully"
                                checked={force}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>

                    <UpdateDetailsModal
                        open={showPreview}
                        isPreview
                        deploymentUpdate={previewData}
                        executionParameters={executionParameters}
                        onClose={() => this.setState({ showPreview: false })}
                        onUpdate={this.onUpdate.bind(this)}
                        toolbox={toolbox}
                    />
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton
                        onClick={this.onPreview.bind(this)}
                        disabled={loading}
                        content="Preview"
                        icon="zoom"
                        color="blue"
                    />
                    <ApproveButton
                        onClick={this.onUpdate.bind(this)}
                        disabled={loading}
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
