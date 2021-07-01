// @ts-nocheck File not migrated fully to TS
import GenericDeployModal from './GenericDeployModal';

function UpdateDeploymentModal({ open, deploymentId, deploymentName, onHide, toolbox }) {
    const { useEffect } = React;
    const { useInputs, useOpenProp, useBoolean, useErrors, useResettableState } = Stage.Hooks;
    const { DeploymentActions, InputsUtils } = Stage.Common;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [isFileLoading, setFileLoading, unsetFileLoading] = useBoolean();
    const [isPreviewShown, showPreview, hidePreview] = useBoolean();
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();

    const [blueprint, setBlueprint, resetBlueprint] = useResettableState(GenericDeployModal.EMPTY_BLUEPRINT);
    const [previewData, setPreviewData, resetPreviewData] = useResettableState({});

    const [deployment, setDeployment, resetDeployment] = useResettableState({});
    const [deploymentInputs, setDeploymentInputs, resetDeploymentInputs] = useInputs({});
    const [inputs, setInput, resetInputs] = useInputs({
        installWorkflow: true,
        uninstallWorkflow: true,
        installWorkflowFirst: false,
        ignoreFailure: false,
        automaticReinstall: true,
        reinstallList: [],
        force: false
    });

    function selectBlueprint(id) {
        if (!_.isEmpty(id)) {
            setLoading();

            const actions = new Stage.Common.BlueprintActions(toolbox);
            actions
                .doGetFullBlueprintData(id)
                .then(fetchedBlueprint => {
                    const newDeploymentInputs = {};
                    const currentDeploymentInputs = deployment.inputs;
                    const { data_types: dataTypes, inputs: plannedDeploymentInputs } = fetchedBlueprint.plan;

                    _.forEach(plannedDeploymentInputs, (inputObj, inputName) => {
                        const { type } = inputObj;
                        const dataType = dataTypes?.[type];

                        newDeploymentInputs[inputName] = InputsUtils.getInputFieldInitialValue(
                            currentDeploymentInputs[inputName],
                            type,
                            dataType
                        );
                    });

                    setDeploymentInputs(newDeploymentInputs);
                    setBlueprint(fetchedBlueprint);
                    clearErrors();
                })
                .catch(err => {
                    resetBlueprint();
                    setMessageAsError(err);
                })
                .finally(unsetLoading);
        } else {
            resetBlueprint();
            clearErrors();
        }
    }

    useEffect(() => {
        if (deployment && deployment.blueprint_id) {
            selectBlueprint(deployment.blueprint_id);
        }
    }, [deployment]);

    useOpenProp(open, () => {
        setLoading();
        unsetFileLoading();
        hidePreview();
        clearErrors();
        resetBlueprint();
        resetDeployment();
        resetDeploymentInputs();
        resetPreviewData();
        resetInputs();

        const actions = new DeploymentActions(toolbox);
        actions
            .doGet({ id: deploymentId }, { _include: _.join(['id', 'blueprint_id', 'inputs']) })
            .then(setDeployment)
            .catch(error => {
                unsetLoading();
                setMessageAsError(error);
            });
    });

    function submitUpdate(preview) {
        const {
            automaticReinstall,
            force,
            ignoreFailure,
            installWorkflow,
            installWorkflowFirst,
            reinstallList,
            uninstallWorkflow
        } = inputs;
        const validationErrors = {};

        if (_.isEmpty(blueprint.id)) {
            validationErrors.blueprintName = 'Please select blueprint';
        }

        if (!_.isEmpty(validationErrors)) {
            setErrors(validationErrors);
            unsetLoading();
            return;
        }

        const inputsPlanForUpdate = InputsUtils.getPlanForUpdate(blueprint.plan.inputs, deployment.inputs);
        const actions = new DeploymentActions(toolbox);
        actions
            .doUpdate(
                deployment.id,
                blueprint.id,
                InputsUtils.getInputsMap(inputsPlanForUpdate, deploymentInputs),
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
                // State updates should be done before calling `onHide` to avoid React errors:
                // "Warning: Can't perform a React state update on an unmounted component"
                clearErrors();
                unsetLoading();
                if (preview) {
                    showPreview();
                    setPreviewData(data);
                } else {
                    toolbox.refresh();
                    toolbox.getEventBus().trigger('nodes:refresh');
                    toolbox.getEventBus().trigger('inputs:refresh');
                    toolbox.getEventBus().trigger('outputs:refresh');
                    toolbox.getEventBus().trigger('executions:refresh');
                    onHide();
                }
            })
            .catch(err => {
                setErrors(InputsUtils.getErrorObject(err.message));
                unsetLoading();
            });
    }

    function onUpdate() {
        clearErrors();
        setLoading();
        hidePreview();
        submitUpdate(false);
        return false;
    }

    function onPreview() {
        clearErrors();
        setLoading();
        hidePreview();
        submitUpdate(true);
        return true;
    }

    function handleYamlFileChange(file) {
        if (!file) {
            return;
        }

        const { FileActions } = Stage.Common;
        const actions = new FileActions(toolbox);
        setFileLoading();

        actions
            .doGetYamlFileContent(file)
            .then(yamlInputs => {
                clearErrors();
                setDeploymentInputs(InputsUtils.getUpdatedInputs(blueprint.plan.inputs, deploymentInputs, yamlInputs));
            })
            .catch(err =>
                setErrors({ yamlFile: `Loading values from YAML file failed: ${_.isString(err) ? err : err.message}` })
            )
            .finally(unsetFileLoading);
    }

    const {
        automaticReinstall,
        force,
        ignoreFailure,
        installWorkflow,
        installWorkflowFirst,
        reinstallList,
        uninstallWorkflow
    } = inputs;
    const { ApproveButton, CancelButton, Form, Header, Icon, Message, Modal } = Stage.Basic;
    const {
        DataTypesButton,
        DynamicDropdown,
        InputsHeader,
        NodeInstancesFilter,
        YamlFileButton,
        UpdateDetailsModal
    } = Stage.Common;

    const executionParameters = isPreviewShown
        ? {
              skip_install: !installWorkflow,
              skip_uninstall: !uninstallWorkflow,
              skip_reinstall: !automaticReinstall,
              reinstall_list: reinstallList
          }
        : {};

    return (
        <Modal open={open} onClose={onHide} className="updateDeploymentModal">
            <Modal.Header>
                <Icon name="edit" /> Update deployment {deploymentName} ({deploymentId})
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} scrollToError onErrorsDismiss={clearErrors}>
                    <Form.Field error={errors.blueprintName} label="Blueprint" required>
                        <DynamicDropdown
                            value={blueprint.id}
                            placeholder="Select Blueprint"
                            name="blueprintName"
                            fetchUrl="/blueprints?_include=id&state=uploaded"
                            onChange={selectBlueprint}
                            toolbox={toolbox}
                        />
                    </Form.Field>

                    {blueprint.id && (
                        <>
                            {!_.isEmpty(blueprint.plan.inputs) && (
                                <YamlFileButton
                                    onChange={handleYamlFileChange}
                                    dataType="deployment's inputs"
                                    fileLoading={isFileLoading}
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
                        setDeploymentInputs,
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
                            onChange={setInput}
                        />
                    </Form.Field>

                    <Form.Field>
                        <Form.Checkbox
                            label="Run uninstall workflow"
                            toggle
                            name="uninstallWorkflow"
                            help="Run uninstall lifecycle operations"
                            checked={uninstallWorkflow}
                            onChange={setInput}
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
                            onChange={setInput}
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
                            onChange={setInput}
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
                            onChange={setInput}
                        />
                    </Form.Field>

                    <NodeInstancesFilter
                        name="reinstallList"
                        deploymentId={deploymentId}
                        label="Reinstall node instances list"
                        value={reinstallList}
                        placeholder="Choose node instances to reinstall"
                        upward
                        onChange={setInput}
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
                            onChange={setInput}
                        />
                    </Form.Field>
                </Form>

                <UpdateDetailsModal
                    open={isPreviewShown}
                    isPreview
                    deploymentUpdate={previewData}
                    executionParameters={executionParameters}
                    onClose={hidePreview}
                    onUpdate={onUpdate}
                    toolbox={toolbox}
                />
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={isLoading} />
                <ApproveButton onClick={onPreview} disabled={isLoading} content="Preview" icon="zoom" color="blue" />
                <ApproveButton onClick={onUpdate} disabled={isLoading} content="Update" icon="edit" color="green" />
            </Modal.Actions>
        </Modal>
    );
}

UpdateDeploymentModal.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    open: PropTypes.bool.isRequired,
    deploymentId: PropTypes.string.isRequired,
    deploymentName: PropTypes.string.isRequired,
    onHide: PropTypes.func.isRequired
};

Stage.defineCommon({
    name: 'UpdateDeploymentModal',
    common: UpdateDeploymentModal
});
