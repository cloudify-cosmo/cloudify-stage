import React from 'react';
import { diffChars } from 'diff';
import { map, keys, chain, isEqual, isEmpty, get, capitalize, lowerCase, filter, size, uniq, noop } from 'lodash';
import PropTypes from 'prop-types';
import {
    ApproveButton,
    CancelButton,
    Card,
    Form,
    Header,
    Icon,
    Label,
    List,
    Modal,
    Popup,
    PopupHelp,
    Table
} from '../../../components/basic';
import ParameterValue from '../components/parameter/ParameterValue';
import ParameterValueDescription from '../components/parameter/ParameterValueDescription';
import ToolboxPropType from '../../../utils/props/Toolbox';
import DeploymentUpdatesActions from './DeploymentUpdatesActions';
import Json from '../../../utils/shared/JsonUtils';
import { useBoolean, useResettableState } from '../../../utils/hooks';

interface BlueprintSectionProps {
    newBlueprint?: string;
    oldBlueprint?: string;
}

function BlueprintSection({ newBlueprint, oldBlueprint }: BlueprintSectionProps) {
    const isChanged = oldBlueprint !== newBlueprint;

    return (
        <>
            <Header>Blueprint</Header>

            {isChanged ? (
                <span>
                    Changed from <strong>{oldBlueprint}</strong> into <strong>{newBlueprint}</strong>.
                </span>
            ) : (
                <span>Not changed.</span>
            )}
        </>
    );
}

interface DiffProps {
    stringA: string;
    stringB: string;
}

function Diff({ stringA, stringB }: DiffProps) {
    const difference = diffChars(String(stringA), String(stringB));

    return (
        <div>
            {map(difference, (part, index) => {
                let style;
                if (part.added) {
                    style = { color: 'green' };
                } else if (part.removed) {
                    style = { color: 'red', textDecoration: 'line-through' };
                }

                return (
                    <span key={`part_${index}`} style={style}>
                        {part.value}
                    </span>
                );
            })}
        </div>
    );
}

interface Inputs {
    [key: string]: string;
}

interface InputSectionProps {
    newInputs: Inputs;
    oldInputs: Inputs;
}

function InputsSection({ oldInputs = {}, newInputs = {} }: InputSectionProps) {
    const [showOnlyChanged, setShowOnlyChanged] = React.useState(false);

    const sortedNewInputs = keys(newInputs).sort();
    const onlyChangedInputs = chain(sortedNewInputs)
        .filter(
            inputName =>
                !isEqual(
                    Json.getStringValue(newInputs[inputName] || ''),
                    Json.getStringValue(oldInputs[inputName] || '')
                )
        )
        .uniq()
        .value();
    const inputsChanged = !isEqual(oldInputs, newInputs);

    return (
        <>
            <Header>
                {inputsChanged && (
                    <Form.Checkbox
                        name="showOnlyChanged"
                        toggle
                        label="Show only changed"
                        help="Show only inputs which have different values"
                        className="rightFloated"
                        checked={showOnlyChanged}
                        onChange={() => setShowOnlyChanged(!showOnlyChanged)}
                    />
                )}
                Inputs
                {inputsChanged && (
                    <Header.Subheader>
                        See details:&nbsp;
                        <PopupHelp
                            content={
                                <div>
                                    <div>
                                        To show only changed inputs use <strong>Show only changed</strong> toggle.
                                    </div>
                                    <br />
                                    <div>
                                        To see difference between old and new inputs hover over&nbsp;
                                        <Icon name="asterisk" color="red" size="tiny" className="superscripted" />
                                        &nbsp;character on the right side of changed input to open popup with change
                                        details.
                                    </div>
                                    <br />
                                    <div>
                                        Inside popup you will see text in:
                                        <List bulleted>
                                            <List.Item>
                                                <span style={{ color: 'green' }}>green</span> - added characters
                                            </List.Item>
                                            <List.Item>
                                                <span style={{ color: 'red' }}>red</span> - removed characters
                                            </List.Item>
                                            <List.Item>
                                                <span style={{ color: 'black' }}>black</span> - unchanged characters
                                            </List.Item>
                                        </List>
                                    </div>
                                </div>
                            }
                        />
                    </Header.Subheader>
                )}
            </Header>

            {inputsChanged ? (
                <Table striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={4}>Input</Table.HeaderCell>
                            <Table.HeaderCell width={6}>
                                Old <ParameterValueDescription />
                            </Table.HeaderCell>
                            <Table.HeaderCell width={6}>
                                New <ParameterValueDescription />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {map(showOnlyChanged ? onlyChangedInputs : newInputs, input => {
                            const oldValue = get(oldInputs, input, '');
                            const oldValueString = Json.getStringValue(oldValue);
                            const newValue = get(newInputs, input, '');
                            const newValueString = Json.getStringValue(newValue);
                            const inputChanged = !isEqual(oldValueString, newValueString);

                            return (
                                <Table.Row key={input}>
                                    <Table.Cell>{input}</Table.Cell>
                                    <Table.Cell>
                                        <ParameterValue value={oldValue} showCopyButton={false} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <ParameterValue value={newValue} showCopyButton={false} />
                                        {inputChanged && (
                                            <Popup>
                                                <Popup.Trigger>
                                                    <Icon
                                                        name="asterisk"
                                                        color="red"
                                                        size="tiny"
                                                        className="superscripted"
                                                    />
                                                </Popup.Trigger>
                                                <Popup.Content>
                                                    <Diff stringA={oldValueString} stringB={newValueString} />
                                                </Popup.Content>
                                            </Popup>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            ) : (
                <span>No inputs changed.</span>
            )}
        </>
    );
}

function NodeInstancesCard({ action, color, icon, instances, name, workflowSkipped }) {
    return (
        <Card key={name} color={color}>
            <Card.Content>
                <Card.Header>
                    <Icon name={icon} color={color} />
                    {capitalize(lowerCase(name))}
                    {action && (
                        <Label className="right floated">
                            {action}: {workflowSkipped ? 'No' : 'Yes'}
                        </Label>
                    )}
                </Card.Header>
                <Card.Description>
                    {!isEmpty(instances) ? (
                        <List bulleted>
                            {map(instances, instance => (
                                <List.Item key={instance}>{instance}</List.Item>
                            ))}
                        </List>
                    ) : (
                        <span>No node instances</span>
                    )}
                </Card.Description>
            </Card.Content>
        </Card>
    );
}

NodeInstancesCard.propTypes = {
    action: PropTypes.string,
    color: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    instances: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    workflowSkipped: PropTypes.bool
};

NodeInstancesCard.defaultProps = {
    action: null,
    workflowSkipped: false
};

function NodeInstancesSection({ types }) {
    const isChanged = !isEmpty(filter(types, type => size(type.instances) > 0));

    return (
        <>
            <Header>
                Node Instances
                {isChanged && (
                    <Header.Subheader>
                        See details:&nbsp;
                        <PopupHelp
                            content={
                                <div>
                                    Four different categories present added, removed, modified, explicitly reinstalled
                                    node instances.
                                    <br />
                                    Bulleted list contain modified node instance ID and node ID in round brackets.
                                    <br />
                                    In upper right corner of the card you can see if install/uninstall/reinstall
                                    workflows are executed.
                                </div>
                            }
                        />
                    </Header.Subheader>
                )}
            </Header>

            {isChanged ? (
                <Card.Group itemsPerRow={2}>
                    {map(types, type => (
                        <NodeInstancesCard
                            key={type.name}
                            name={type.name}
                            color={type.color}
                            icon={type.icon}
                            instances={type.instances}
                            action={type.action}
                            workflowSkipped={type.workflowSkipped}
                        />
                    ))}
                </Card.Group>
            ) : (
                <span>No node instances changed.</span>
            )}
        </>
    );
}

NodeInstancesSection.propTypes = {
    types: PropTypes.arrayOf(
        PropTypes.shape({
            ...NodeInstancesCard.propTypes
        })
    ).isRequired
};

function StepsSection({ steps }) {
    const stepsPresent = !isEmpty(steps);

    return (
        <>
            <Header>
                Steps
                {stepsPresent && <Header.Subheader>Action steps taken during update.</Header.Subheader>}
            </Header>
            {stepsPresent ? (
                <Table striped definition>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell collapsing />
                            <Table.HeaderCell>Action</Table.HeaderCell>
                            <Table.HeaderCell>Entity Type</Table.HeaderCell>
                            <Table.HeaderCell>Entity ID</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {map(steps, (step, index) => (
                            <Table.Row key={step.id}>
                                <Table.Cell>{index + 1}</Table.Cell>
                                <Table.Cell>{step.action}</Table.Cell>
                                <Table.Cell>{step.entity_type}</Table.Cell>
                                <Table.Cell>{step.entity_id}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            ) : (
                <span>No action steps.</span>
            )}
        </>
    );
}

StepsSection.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.shape({}))
};

StepsSection.defaultProps = { steps: null };

const EMPTY_DEPLOYMENT_UPDATE = {
    old_inputs: {},
    new_inputs: {},
    old_blueprint_id: '',
    new_blueprint_id: '',
    steps: []
};

const EMPTY_EXECUTION_PARAMETERS = {
    skip_install: false,
    skip_uninstall: false,
    skip_reinstall: false,
    reinstall_list: []
};

function UpdateDetailsModal({
    deploymentUpdateId,
    executionParameters: providedExecutionParameters,
    open,
    toolbox,
    isPreview,
    onClose,
    onUpdate,
    deploymentUpdate: providedDeploymentUpdate
}) {
    const { useEffect } = React;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [deploymentUpdate, setDeploymentUpdate, resetDeploymentUpdate] = useResettableState(
        !isEmpty(deploymentUpdateId) ? EMPTY_DEPLOYMENT_UPDATE : providedDeploymentUpdate
    );
    const [executionParameters, setExecutionParameters, resetExecutionParameters] =
        useResettableState(EMPTY_EXECUTION_PARAMETERS);

    useEffect(() => {
        if (!isEmpty(deploymentUpdateId) && open) {
            setLoading();
            const actions = new DeploymentUpdatesActions(toolbox);
            actions
                .doGetUpdate(deploymentUpdateId)
                .then(fetchedDeploymentUpdate => {
                    if (isEmpty(providedExecutionParameters) && !isEmpty(fetchedDeploymentUpdate.execution_id)) {
                        actions
                            .doGetExecutionParameters(fetchedDeploymentUpdate.execution_id)
                            .then(({ parameters }) => {
                                setDeploymentUpdate(fetchedDeploymentUpdate);
                                setExecutionParameters(parameters);
                            })
                            .catch(resetDeploymentUpdate)
                            .finally(unsetLoading);
                    } else {
                        unsetLoading();
                        setDeploymentUpdate(fetchedDeploymentUpdate);
                    }
                })
                .catch(() => {
                    unsetLoading();
                    resetDeploymentUpdate();
                });
        } else if (!open) {
            unsetLoading();
            resetDeploymentUpdate();
            resetExecutionParameters();
        }
    }, [open]);

    useEffect(() => {
        if (isEmpty(deploymentUpdateId)) {
            setDeploymentUpdate(providedDeploymentUpdate);
        }
    }, [providedDeploymentUpdate]);

    function getInstances(type) {
        const instances = get(deploymentUpdate, `deployment_update_node_instances.${type}_and_related.affected`, []);
        return map(instances, instance => instance.id);
    }

    const effectiveExecutionParameters = !isEmpty(providedExecutionParameters)
        ? providedExecutionParameters
        : executionParameters;

    let header = `Deployment update details${isPreview ? ' preview' : ''}`;
    if (!isPreview && deploymentUpdate.id) {
        header += ` - ${deploymentUpdate.id}`;
    }

    return (
        <div>
            <Modal open={open} onClose={() => onClose()} className="updateDetailsModal">
                <Modal.Header>
                    <Icon name="zoom" /> {header}
                </Modal.Header>

                <Modal.Content scrolling>
                    <Form loading={isLoading}>
                        <BlueprintSection
                            oldBlueprint={deploymentUpdate.old_blueprint_id}
                            newBlueprint={deploymentUpdate.new_blueprint_id}
                        />

                        <InputsSection
                            oldInputs={deploymentUpdate.old_inputs}
                            newInputs={deploymentUpdate.new_inputs}
                        />

                        <NodeInstancesSection
                            types={[
                                {
                                    name: 'add',
                                    icon: 'plus',
                                    color: 'green',
                                    action: 'Install',
                                    workflowSkipped: effectiveExecutionParameters.skip_install,
                                    instances: getInstances('added')
                                },
                                {
                                    name: 'remove',
                                    icon: 'minus',
                                    color: 'red',
                                    action: 'Uninstall',
                                    workflowSkipped: effectiveExecutionParameters.skip_uninstall,
                                    instances: getInstances('removed')
                                },
                                {
                                    name: 'modify',
                                    icon: 'edit',
                                    color: 'teal',
                                    action: 'Reinstall',
                                    workflowSkipped: effectiveExecutionParameters.skip_reinstall,
                                    instances: uniq([...getInstances('extended'), ...getInstances('reduced')])
                                },
                                {
                                    name: 'explicit_reinstall',
                                    icon: 'sync',
                                    color: 'blue',
                                    instances: effectiveExecutionParameters.reinstall_list
                                }
                            ]}
                        />

                        <StepsSection steps={deploymentUpdate.steps} />
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={onClose} content="Close" />
                    {isPreview && <ApproveButton onClick={onUpdate} content="Update" icon="edit" />}
                </Modal.Actions>
            </Modal>
        </div>
    );
}

UpdateDetailsModal.propTypes = {
    toolbox: ToolboxPropType.isRequired,
    open: PropTypes.bool.isRequired,
    isPreview: PropTypes.bool,
    deploymentUpdateId: PropTypes.string,
    deploymentUpdate: PropTypes.shape({
        id: PropTypes.string,
        new_blueprint_id: PropTypes.string,
        new_inputs: PropTypes.shape({}),
        old_blueprint_id: PropTypes.string,
        old_inputs: PropTypes.shape({}),
        steps: PropTypes.arrayOf(PropTypes.shape({}))
    }),
    executionParameters: PropTypes.shape({
        reinstall_list: PropTypes.arrayOf(PropTypes.string),
        skip_install: PropTypes.bool,
        skip_reinstall: PropTypes.bool,
        skip_uninstall: PropTypes.bool
    }),
    onClose: PropTypes.func,
    onUpdate: PropTypes.func
};

UpdateDetailsModal.defaultProps = {
    isPreview: false,
    deploymentUpdateId: '',
    deploymentUpdate: {},
    executionParameters: {},
    onClose: noop,
    onUpdate: noop
};

export default UpdateDetailsModal;
