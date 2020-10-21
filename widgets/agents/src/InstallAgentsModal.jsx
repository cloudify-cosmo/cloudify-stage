/**
 * Created by jakub.niezgoda on 09/10/2018.
 */

import Consts from './consts';
import AgentsPropType from './props/AgentsPropType';

export default function InstallAgentsModal({
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
            managerCertificate: '',
            managerIp: '',
            nodeFilter: {
                blueprintId: '',
                deploymentId: _.isArray(deploymentId) ? deploymentId[0] : deploymentId || '',
                nodeId: _.isNil(nodeId) ? [] : _.castArray(nodeId),
                nodeInstanceId: _.isNil(nodeInstanceId) ? [] : _.castArray(nodeInstanceId)
            },
            stopOldAgent: false
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
            setAllowedNodeInstances(getAgentsAttributeList('id'));
        }
    }, [open]);

    function onShowExecutionStatus() {
        const { deploymentId: selectedDeploymentId } = inputValues.nodeFilter;

        onHide();
        toolbox.drillDown(
            widget,
            'execution',
            { deploymentId: selectedDeploymentId, executionId },
            `Install New Agents on ${selectedDeploymentId}`
        );
    }

    function submitExecute() {
        const { nodeFilter, installMethods: methods, managerCertificate, managerIp, stopOldAgent } = inputValues;
        if (!nodeFilter.deploymentId) {
            setErrors({ error: 'Provide deployment in Nodes filter' });
            return;
        }

        setLoading(true);
        const params = {
            node_ids: !_.isEmpty(nodeFilter.nodeId) ? nodeFilter.nodeId : undefined,
            node_instance_ids: !_.isEmpty(nodeFilter.nodeInstanceId) ? nodeFilter.nodeInstanceId : undefined,
            install_methods: !_.isEmpty(methods) ? methods : undefined,
            stop_old_agent: stopOldAgent,
            manager_ip: !_.isEmpty(managerIp) ? managerIp : undefined,
            manager_certificate: !_.isEmpty(managerCertificate) ? managerCertificate : undefined
        };

        const actions = new Stage.Common.DeploymentActions(toolbox);
        actions
            .doExecute({ id: nodeFilter.deploymentId }, { name: 'install_new_agents' }, params, false)
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

    function handleInputChange(event, field) {
        setInputValues({ ...inputValues, ...Stage.Basic.Form.fieldNameValue(field) });
    }

    if (!open) return null;

    const { ApproveButton, Button, CancelButton, Form, Icon, Message, Modal } = Stage.Basic;
    const { NodeFilter } = Stage.Common;

    return (
        <Modal open onClose={onHide}>
            <Modal.Header>
                <Icon name="download" /> Install new agents
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
                                    value={installMethods}
                                    onChange={handleInputChange}
                                />
                            </Form.Field>

                            <Form.Field
                                label="Manager IP"
                                help="The private IP of the current leader (master) Manager.
                                          This IP is used to connect to the Manager's RabbitMQ.
                                          Relevant only in HA cluster."
                            >
                                <Form.Input
                                    name="managerIp"
                                    value={inputValues.managerIp}
                                    onChange={handleInputChange}
                                />
                            </Form.Field>

                            <Form.Field
                                label="Manager Certificate"
                                help="A path to a file containing the SSL certificate
                                          of the current leader Manager. The certificate
                                          is available on the Manager:
                                          /etc/cloudify/ssl/cloudify_internal_ca_cert.pem"
                            >
                                <Form.Input
                                    name="managerCertificate"
                                    value={inputValues.managerCertificate}
                                    onChange={handleInputChange}
                                />
                            </Form.Field>

                            <Form.Field
                                help="If set, after installing the new agent the old agent
                                          (that is connected to the old Cloudify Manager) will be stopped.
                                          *IMPORTANT* if the deployment has monitoring with auto-healing configured,
                                          you need to disable it first"
                            >
                                <Form.Checkbox
                                    label="Stop old agent"
                                    toggle
                                    name="stopOldAgent"
                                    checked={inputValues.stopOldAgent}
                                    onChange={handleInputChange}
                                />
                            </Form.Field>
                        </>
                    )}

                    <Message
                        success
                        header="Execution started"
                        content="New agents installation has been started. Click 'Show Status and Logs' button to see details."
                    />
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton content={executionStarted ? 'Close' : undefined} onClick={onCancel} disabled={loading} />
                {!executionStarted && (
                    <ApproveButton
                        onClick={onApprove}
                        disabled={loading}
                        content="Install"
                        icon="download"
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

InstallAgentsModal.propTypes = {
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

InstallAgentsModal.defaultProps = {
    agents: [],
    deploymentId: '',
    nodeId: [],
    nodeInstanceId: [],
    installMethods: []
};
