/**
 * Created by jakub.niezgoda on 05/10/2018.
 */

import Consts from './consts';
import AgentsPropType from './props/AgentsPropType';

export default function ValidateAgentsModal({
    agents,
    deploymentId,
    installMethods,
    nodeId,
    nodeInstanceId,
    onHide,
    open,
    toolbox,
    widget
}) {
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

    const [allowedDeployments, setAllowedDeployments] = useState(null);
    const [allowedNodes, setAllowedNodes] = useState(null);
    const [allowedNodeInstances, setAllowedNodeInstances] = useState(null);
    const [loading, setLoading] = useState(false);
    const [executionId, setExecutionId] = useState('');
    const [executionStarted, setExecutionStarted] = useState(false);
    const [errors, setErrors] = useState({});
    const [inputValues, setInputValues] = useState(getInitialInputValues());

    function getAgentsAttributeList(attributeName) {
        return _.chain(agents)
            .map(attributeName)
            .uniq()
            .value();
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
            setAllowedNodeInstances(getAgentsAttributeList('id'));
        }
    }, [open]);

    function onApprove() {
        submitExecute();
        return false;
    }

    function onCancel() {
        onHide();
        return true;
    }

    function onShowExecutionStatus() {
        const { deploymentId } = inputValues.nodeFilter;

        onHide();
        toolbox.drillDown(widget, 'execution', { deploymentId, executionId }, `Validate Agents on ${deploymentId}`);
    }

    function submitExecute() {
        const { nodeFilter, installMethods } = inputValues;
        if (!nodeFilter.deploymentId) {
            setErrors({ error: 'Provide deployment in Nodes filter' });
            return false;
        }

        setLoading(true);
        const params = {
            node_ids: !_.isEmpty(nodeFilter.nodeId) ? nodeFilter.nodeId : undefined,
            node_instance_ids: !_.isEmpty(nodeFilter.nodeInstanceId) ? nodeFilter.nodeInstanceId : undefined,
            install_methods: !_.isEmpty(installMethods) ? installMethods : undefined
        };

        const actions = new Stage.Common.DeploymentActions(toolbox);
        actions
            .doExecute({ id: nodeFilter.deploymentId }, { name: 'validate_agents' }, params, false)
            .then(data => {
                setErrors({});
                setExecutionStarted(true);
                setExecutionId(data.id);
            })
            .catch(err => setErrors({ error: err.message }))
            .finally(() => setLoading(false));
    }

    function handleInputChange(event, field) {
        setInputValues({ ...inputValues, ...Stage.Basic.Form.fieldNameValue(field) });
    }

    const { ApproveButton, Button, CancelButton, Form, Icon, Message, Modal } = Stage.Basic;
    const { NodeFilter } = Stage.Common;

    return (
        <Modal open={open} onClose={() => onHide()}>
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
                                    toolbox={toolbox}
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
                                    options={Consts.installMethodsOptions}
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
                    <ApproveButton
                        onClick={onApprove}
                        disabled={loading}
                        content="Validate"
                        icon="checkmark"
                        color="green"
                    />
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

ValidateAgentsModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired,

    agents: AgentsPropType,
    // eslint-disable-next-line react/no-unused-prop-types
    deploymentId: Stage.PropTypes.StringOrArray,
    // eslint-disable-next-line react/no-unused-prop-types
    nodeId: Stage.PropTypes.StringOrArray,
    // eslint-disable-next-line react/no-unused-prop-types
    nodeInstanceId: Stage.PropTypes.StringOrArray,
    // eslint-disable-next-line react/no-unused-prop-types
    installMethods: Stage.PropTypes.StringOrArray
};

ValidateAgentsModal.defaultProps = {
    agents: [],
    deploymentId: '',
    nodeId: [],
    nodeInstanceId: [],
    installMethods: []
};
