import React, { useEffect } from 'react';
import { isEmpty, forEach, join, isString } from 'lodash';
import { ApproveButton, CancelButton, Form, Header, Icon, Message, Modal } from '../../../components/basic';
import FileActions from '../actions/FileActions';
import BlueprintActions from '../blueprints/BlueprintActions';
import DynamicDropdown from '../components/DynamicDropdown';
import type { DynamicDropdownProps } from '../components/DynamicDropdown';
import DataTypesButton from '../inputs/DataTypesButton';
import YamlFileButton from '../inputs/YamlFileButton';
import DeploymentActions from './DeploymentActions';
import type { FullBlueprintData } from '../blueprints/BlueprintActions';
import getInputFieldInitialValue from '../inputs/utils/getInputFieldInitialValue';
import getPlanForUpdate from '../inputs/utils/getPlanForUpdate';
import getInputsMap from '../inputs/utils/getInputsMap';
import { getErrorObject } from '../inputs/utils/errors';
import getUpdatedInputs from '../inputs/utils/getUpdatedInputs';
import InputsHeader from '../inputs/InputsHeader';
import InputFields from '../inputs/InputFields';
import NodeInstancesFilter from '../nodes/NodeInstancesFilter';
import UpdateDetailsModal from './UpdateDetailsModal';
import { useBoolean, useErrors, useInputs, useOpenProp, useResettableState } from '../../../utils/hooks';
import StageUtils from '../../../utils/stageUtils';
import type { Deployment } from '../deploymentsView/types';

type FetchedDeployment = Pick<Deployment, 'blueprint_id' | 'id' | 'inputs'>;

interface UpdateDeploymentModalProps {
    toolbox: Stage.Types.Toolbox;
    open: boolean;
    deploymentId: string;
    deploymentName: string;
    onHide: () => void;
}

export default function UpdateDeploymentModal({
    open,
    deploymentId,
    deploymentName,
    onHide,
    toolbox
}: UpdateDeploymentModalProps) {
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [isFileLoading, setFileLoading, unsetFileLoading] = useBoolean();
    const [isPreviewShown, showPreview, hidePreview] = useBoolean();
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();

    const [blueprint, setBlueprint, resetBlueprint] = useResettableState<FullBlueprintData | undefined>(undefined);
    const [previewData, setPreviewData, resetPreviewData] = useResettableState({});

    const [deployment, setDeployment, resetDeployment] = useResettableState<FetchedDeployment | undefined>(undefined);
    const [deploymentInputs, setDeploymentInputs, resetDeploymentInputs] = useInputs({});
    const [inputs, setInput, resetInputs] = useInputs({
        installWorkflow: true,
        uninstallWorkflow: true,
        installWorkflowFirst: false,
        ignoreFailure: false,
        automaticReinstall: true,
        reinstallList: [],
        skipHeal: false,
        skipDriftCheck: false,
        force: false
    });

    function selectBlueprint(id: string) {
        if (!isEmpty(id)) {
            setLoading();

            const actions = new BlueprintActions(toolbox);
            actions
                .doGetFullBlueprintData(id)
                .then(fetchedBlueprint => {
                    const newDeploymentInputs: Record<string, string> = {};
                    const currentDeploymentInputs = deployment?.inputs;
                    const { data_types: dataTypes, inputs: plannedDeploymentInputs } = fetchedBlueprint.plan;

                    forEach(plannedDeploymentInputs, (inputObj, inputName) => {
                        const { default: defaultValue, type } = inputObj as {
                            type: string;
                            default: unknown;
                        };
                        const dataType = (dataTypes as Record<string, any>)?.[type];

                        newDeploymentInputs[inputName] = getInputFieldInitialValue(
                            currentDeploymentInputs?.[inputName] ?? defaultValue,
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

        const actions = new DeploymentActions(toolbox.getManager());
        actions
            .doGet({ id: deploymentId }, { _include: join(['id', 'blueprint_id', 'inputs']) })
            .then(setDeployment)
            .catch(error => {
                unsetLoading();
                setMessageAsError(error);
            });
    });

    function submitUpdate(preview: boolean) {
        const {
            automaticReinstall,
            force,
            ignoreFailure,
            installWorkflow,
            installWorkflowFirst,
            reinstallList,
            uninstallWorkflow,
            skipHeal,
            skipDriftCheck
        } = inputs;
        const validationErrors: Record<string, string> = {};

        if (isEmpty(blueprint?.id)) {
            validationErrors.blueprintName = 'Please select blueprint';
        }

        if (!isEmpty(validationErrors)) {
            setErrors(validationErrors);
            unsetLoading();
            return;
        }

        const inputsPlanForUpdate = getPlanForUpdate(blueprint!.plan.inputs, deployment!.inputs);
        const inputsMap = getInputsMap(inputsPlanForUpdate, deploymentInputs);
        const blueprintId = blueprint!.id === deployment!.blueprint_id && isEmpty(inputsMap) ? null : blueprint!.id;

        const actions = new DeploymentActions(toolbox.getManager());
        actions
            .doUpdate(
                deployment!.id,
                blueprintId || '',
                inputsMap,
                installWorkflow,
                uninstallWorkflow,
                installWorkflowFirst,
                ignoreFailure,
                automaticReinstall,
                reinstallList,
                skipHeal,
                skipDriftCheck,
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
                setErrors(getErrorObject(err.message));
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

    function handleYamlFileChange(file: File | null) {
        if (!file || !blueprint) {
            return;
        }

        const actions = new FileActions(toolbox);
        setFileLoading();

        actions
            .doGetYamlFileContent(file)
            .then(yamlInputs => {
                clearErrors();
                setDeploymentInputs(getUpdatedInputs(blueprint.plan.inputs, deploymentInputs, yamlInputs));
            })
            .catch(err =>
                setErrors({ yamlFile: `Loading values from YAML file failed: ${isString(err) ? err : err.message}` })
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
        uninstallWorkflow,
        skipHeal,
        skipDriftCheck
    } = inputs;

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
                <Icon name="edit" /> Update deployment{' '}
                {StageUtils.formatDisplayName({
                    id: deploymentId,
                    displayName: deploymentName
                })}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} scrollToError onErrorsDismiss={clearErrors}>
                    <Form.Field error={errors.blueprintName} label="Blueprint" required>
                        <DynamicDropdown
                            value={blueprint?.id || ''}
                            placeholder="Select Blueprint"
                            name="blueprintName"
                            fetchUrl="/blueprints?_include=id&state=uploaded"
                            onChange={selectBlueprint as DynamicDropdownProps['onChange']}
                            toolbox={toolbox}
                        />
                    </Form.Field>

                    {blueprint?.id && (
                        <>
                            {!isEmpty(blueprint.plan.inputs) && (
                                <YamlFileButton
                                    onChange={handleYamlFileChange}
                                    dataType="deployment's inputs"
                                    fileLoading={isFileLoading}
                                />
                            )}
                            {!isEmpty(blueprint.plan.data_types) && (
                                <DataTypesButton types={blueprint.plan.data_types} />
                            )}
                            <InputsHeader />
                            {isEmpty(blueprint.plan.inputs) && (
                                <Message content="No inputs available for the selected blueprint" />
                            )}
                        </>
                    )}

                    <InputFields
                        inputs={blueprint?.plan?.inputs || {}}
                        onChange={setDeploymentInputs}
                        inputsState={deploymentInputs}
                        errorsState={errors}
                        toolbox={toolbox}
                        dataTypes={blueprint?.plan?.data_types || {}}
                    />

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
                            label="Skip heal"
                            name="skipHeal"
                            toggle
                            help="Don't attempt to perform heal if a node instance has a bad status"
                            checked={skipHeal}
                            onChange={setInput}
                        />
                    </Form.Field>

                    <Form.Field>
                        <Form.Checkbox
                            label="Skip drift check"
                            name="skipDriftCheck"
                            toggle
                            help="Drift check will not be performed prior to the update"
                            checked={skipDriftCheck}
                            onChange={setInput}
                        />
                    </Form.Field>

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
                <ApproveButton onClick={onUpdate} disabled={isLoading} content="Update" icon="edit" />
            </Modal.Actions>
        </Modal>
    );
}
