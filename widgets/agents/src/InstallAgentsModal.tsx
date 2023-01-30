import { castArray, chain, isArray, isEmpty, isNil } from 'lodash';
import type { StrictDropdownProps, StrictCheckboxProps, StrictInputProps } from 'semantic-ui-react';
import type { Field } from 'app/widgets/common/types';
import type { Agent, AgentsModalProps } from './types';
import { installMethodsOptions } from './consts';
import type { NodeFilterProps } from './NodeFilter';
import NodeFilter from './NodeFilter';
import { translate } from './utils';

const translateCommon = Stage.Utils.composeT(translate, 'modals.common');
const translateInstall = Stage.Utils.composeT(translate, 'modals.install');

type InstallAgentsModalProps = AgentsModalProps;

export default function InstallAgentsModal({
    agents = [],
    deploymentId = '',
    installMethods = [],
    nodeId = [],
    nodeInstanceId = [],
    onHide,
    open,
    manager,
    drilldownHandler
}: InstallAgentsModalProps) {
    const { useEffect, useState } = React;

    function getInitialInputValues() {
        return {
            installMethods: isNil(installMethods) ? [] : castArray(installMethods),
            managerCertificate: '',
            managerIp: '',
            nodeFilter: {
                blueprintId: '',
                deploymentId: isArray(deploymentId) ? deploymentId[0] : deploymentId || '',
                nodeId: isNil(nodeId) ? [] : castArray(nodeId),
                nodeInstanceId: isNil(nodeInstanceId) ? [] : castArray(nodeInstanceId)
            },
            stopOldAgent: false
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
        return chain(agents).map(attributeName).uniq().value();
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
            translateInstall('pageName', { deploymentId: selectedDeploymentId })
        );
    }

    function submitExecute() {
        const { nodeFilter, installMethods: methods, managerCertificate, managerIp, stopOldAgent } = inputValues;
        if (!nodeFilter.deploymentId) {
            setErrors({ error: translateCommon('deploymentError') });
            return;
        }

        setLoading(true);
        const params = {
            node_ids: !isEmpty(nodeFilter.nodeId) ? nodeFilter.nodeId : undefined,
            node_instance_ids: !isEmpty(nodeFilter.nodeInstanceId) ? nodeFilter.nodeInstanceId : undefined,
            install_methods: !isEmpty(methods) ? methods : undefined,
            stop_old_agent: stopOldAgent,
            manager_ip: !isEmpty(managerIp) ? managerIp : undefined,
            manager_certificate: !isEmpty(managerCertificate) ? managerCertificate : undefined
        };

        const actions = new Stage.Common.Deployments.Actions(manager);
        actions
            .doExecute(nodeFilter.deploymentId, 'install_new_agents', params)
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
                <Icon name="download" /> ${translateInstall('header')}
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
                                label={translateCommon('fields.nodeFilter.label')}
                                required
                                help={translateCommon('fields.nodeFilter.description')}
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
                                label={translateCommon('fields.installMethods.label')}
                                help={translateCommon('fields.installMethods.description')}
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

                            <Form.Field
                                label={translateInstall('fields.managerIp.label')}
                                help={translateInstall('fields.managerIp.description')}
                            >
                                <Form.Input
                                    name="managerIp"
                                    value={inputValues.managerIp}
                                    onChange={handleInputChange}
                                />
                            </Form.Field>

                            <Form.Field
                                label={translateInstall('fields.managerCertificate.label')}
                                help={translateInstall('fields.managerCertificate.description')}
                            >
                                <Form.Input
                                    name="managerCertificate"
                                    value={inputValues.managerCertificate}
                                    onChange={handleInputChange}
                                />
                            </Form.Field>

                            <Form.Field help={translateInstall('fields.stopOldAgent.description')}>
                                <Form.Checkbox
                                    label={translateInstall('fields.stopOldAgent.label')}
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
                        header={translateCommon('executionStartedMessage.header')}
                        content={translateCommon('executionStartedMessage.content', {
                            execution: translateInstall('execution')
                        })}
                    />
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton
                    content={executionStarted ? translateCommon('buttons.close') : undefined}
                    onClick={onCancel}
                    disabled={loading}
                />
                {!executionStarted && (
                    <ApproveButton
                        onClick={onApprove}
                        disabled={loading}
                        content={translateCommon('buttons.install')}
                        icon="download"
                    />
                )}
                {executionStarted && (
                    <Button
                        content={translateCommon('buttons.showStatus')}
                        icon="file text"
                        color="green"
                        onClick={onShowExecutionStatus}
                    />
                )}
            </Modal.Actions>
        </Modal>
    );
}
