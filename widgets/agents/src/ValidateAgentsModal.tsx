import type { StrictDropdownProps, StrictCheckboxProps, StrictInputProps } from 'semantic-ui-react';
import type { Field } from 'app/widgets/common/types';
import type { Agent, AgentsModalProps } from './types';
import NodeFilter from './NodeFilter';
import type { NodeFilterProps } from './NodeFilter';
import { installMethodsOptions } from './consts';

type ValidateAgentsModalProps = AgentsModalProps;

export default function ValidateAgentsModal({
    agents = [],
    deploymentId = '',
    installMethods = [],
    nodeId = [],
    nodeInstanceId = [],
    onHide,
    open,
    manager,
    drilldownHandler
}: ValidateAgentsModalProps) {
    const { useEffect, useState } = React;

    function getInitialInputValues() {
        return {
            installMethods: _.isNil(installMethods) ? [] : _.castArray(installMethods),
            nodeFilter: {
                blueprintId: '',
                deploymentId: _.isArray(deploymentId) ? deploymentId[0] : deploymentId || '',
                nodeId: _.isNil(nodeId) ? [] : _.castArray(nodeId),
                nodeInstanceId: _.isNil(nodeInstanceId) ? [] : _.castArray(nodeInstanceId)
            }
        };
    }

    const [allowedDeployments, setAllowedDeployments] = useState<string[] | undefined>();
    const [allowedNodes, setAllowedNodes] = useState<string[] | undefined>();
    const [allowedNodeInstances, setAllowedNodeInstances] = useState<string[] | undefined>();
    const [loading, setLoading] = useState(false);
    const [executionId, setExecutionId] = useState('');
    const [executionStarted, setExecutionStarted] = useState(false);
    const [errors, setErrors] = useState({});
    const [inputValues, setInputValues] = useState(getInitialInputValues());

    function getAgentsAttributeList(attributeName: keyof Agent) {
        return _.chain(agents).map(attributeName).uniq().value();
    }

    useEffect(() => {
        if (open) {
            setLoading(false);
            setExecutionId('');
            setExecutionStarted(false);
            setErrors({});
            setInputValues(getInitialInputValues());
            setAllowedDeployments(getAgentsAttributeList('deployment'));
            setAllowedNodes(getAgentsAttributeList('node'));
            setAllowedNodeInstances(getAgentsAttributeList('host_id'));
        }
    }, [open]);

    function onShowExecutionStatus() {
        const { deploymentId: selectedDeploymentId } = inputValues.nodeFilter;

        onHide();
        drilldownHandler(
            'execution',
            { deploymentId: selectedDeploymentId, executionId },
            `Validate Agents on ${selectedDeploymentId}`
        );
    }

    function submitExecute() {
        const { nodeFilter, installMethods: methods } = inputValues;
        if (!nodeFilter.deploymentId) {
            setErrors({ error: 'Provide deployment in Nodes filter' });
            return;
        }

        setLoading(true);
        const params = {
            node_ids: !_.isEmpty(nodeFilter.nodeId) ? nodeFilter.nodeId : undefined,
            node_instance_ids: !_.isEmpty(nodeFilter.nodeInstanceId) ? nodeFilter.nodeInstanceId : undefined,
            install_methods: !_.isEmpty(methods) ? methods : undefined
        };

        const actions = new Stage.Common.Deployments.Actions(manager);
        actions
            .doExecute(nodeFilter.deploymentId, 'validate_agents', params)
            .then(data => {
                setErrors({});
                setExecutionStarted(true);
                setExecutionId(data.id);
            })
            .catch(err => setErrors({ error: err.message }))
            .finally(() => setLoading(false));
    }

    function onApprove() {
        submitExecute();
        return false;
    }

    function onCancel() {
        onHide();
        return true;
    }

    const handleInputChange: (NodeFilterProps &
        StrictDropdownProps &
        StrictCheckboxProps &
        StrictInputProps)['onChange'] = (_event, field) => {
        setInputValues({ ...inputValues, ...Stage.Basic.Form.fieldNameValue(field as Field) });
    };

    if (!open) return null;

    const { ApproveButton, Button, CancelButton, Form, Icon, Message, Modal } = Stage.Basic;

    return (
        <Modal open onClose={onHide}>
            <Modal.Header>
                <Icon name="checkmark" /> Validate agents
            </Modal.Header>

            <Modal.Content>
                <Form
                    loading={loading}
                    errors={errors}
                    success={executionStarted}
                    onErrorsDismiss={() => setErrors({})}
                >
                    {!executionStarted && (
                        <>
                            <Form.Field
                                label="Nodes filter"
                                required
                                help="Filter agents by deployment, nodes and node instances. Filtering turned off when none selected."
                            >
                                <NodeFilter
                                    name="nodeFilter"
                                    value={inputValues.nodeFilter}
                                    showBlueprints={false}
                                    allowMultipleNodes
                                    allowMultipleNodeInstances
                                    allowedDeployments={allowedDeployments}
                                    allowedNodes={allowedNodes}
                                    allowedNodeInstances={allowedNodeInstances}
                                    onChange={handleInputChange}
                                    manager={manager}
                                />
                            </Form.Field>

                            <Form.Field
                                label="Install Methods filter"
                                help="Filter agents by install methods. Filtering turned off when none selected."
                            >
                                <Form.Dropdown
                                    name="installMethods"
                                    multiple
                                    selection
                                    options={installMethodsOptions}
                                    value={inputValues.installMethods}
                                    onChange={handleInputChange}
                                />
                            </Form.Field>
                        </>
                    )}

                    <Message
                        success
                        header="Execution started"
                        content="Agents validation has been started. Click 'Show Status and Logs' button to see details."
                    />
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton content={executionStarted ? 'Close' : undefined} onClick={onCancel} disabled={loading} />
                {!executionStarted && (
                    <ApproveButton onClick={onApprove} disabled={loading} content="Validate" icon="checkmark" />
                )}
                {executionStarted && (
                    <Button
                        content="Show Status and Logs"
                        icon="file text"
                        color="green"
                        onClick={onShowExecutionStatus}
                    />
                )}
            </Modal.Actions>
        </Modal>
    );
}
