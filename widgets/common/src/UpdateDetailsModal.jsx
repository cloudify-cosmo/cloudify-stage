/**
 * Created by jakubniezgoda on 10/05/2018.
 */

import { diffChars } from 'diff';

function BlueprintSection({ newBlueprint, oldBlueprint }) {
    const { Header } = Stage.Basic;
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

BlueprintSection.propTypes = {
    newBlueprint: PropTypes.string,
    oldBlueprint: PropTypes.string
};

BlueprintSection.defaultProps = {
    newBlueprint: null,
    oldBlueprint: null
};

class InputsSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showOnlyChanged: false
        };
    }

    render() {
        const { showOnlyChanged } = this.state;
        const { oldInputs: oldInputsProp, newInputs: newInputsProp } = this.props;
        const { Form, Header, Icon, List, Popup, PopupHelp, Table } = Stage.Basic;
        const { ParameterValue, ParameterValueDescription } = Stage.Common;
        const { Json } = Stage.Utils;

        const newInputs = Array.sort(_.keys(newInputsProp));
        const onlyChangedInputs = _.chain(newInputs)
            .filter(
                inputName =>
                    !_.isEqual(
                        Json.getStringValue(newInputsProp[inputName] || ''),
                        Json.getStringValue(oldInputsProp[inputName] || '')
                    )
            )
            .uniq()
            .value();
        const inputsChanged = !_.isEqual(oldInputsProp, newInputsProp);

        const Diff = ({ stringA, stringB }) => {
            const difference = diffChars(String(stringA), String(stringB));

            return (
                <div>
                    {_.map(difference, (part, index) => {
                        const style = part.added
                            ? { color: 'green' }
                            : part.removed
                            ? { color: 'red', textDecoration: 'line-through' }
                            : null;
                        return (
                            <span key={`part_${index}`} style={style}>
                                {part.value}
                            </span>
                        );
                    })}
                </div>
            );
        };

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
                            onChange={() => this.setState({ showOnlyChanged: !showOnlyChanged })}
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
                            {_.map(showOnlyChanged ? onlyChangedInputs : newInputs, input => {
                                const oldValue = _.get(oldInputsProp, input, '');
                                const oldValueString = Json.getStringValue(oldValue);
                                const newValue = _.get(newInputsProp, input, '');
                                const newValueString = Json.getStringValue(newValue);
                                const inputChanged = !_.isEqual(oldValueString, newValueString);

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
}

InputsSection.propTypes = {
    newInputs: PropTypes.shape({}),
    oldInputs: PropTypes.shape({})
};

InputsSection.defaultProps = {
    newInputs: {},
    oldInputs: {}
};

function NodeInstancesCard({ action, color, icon, instances, name, workflowSkipped }) {
    const { Card, Icon, Label, List } = Stage.Basic;

    return (
        <Card key={name} color={color}>
            <Card.Content>
                <Card.Header>
                    <Icon name={icon} color={color} />
                    {_.capitalize(_.lowerCase(name))}
                    {action && (
                        <Label className="right floated">
                            {action}: {workflowSkipped ? 'No' : 'Yes'}
                        </Label>
                    )}
                </Card.Header>
                <Card.Description>
                    {!_.isEmpty(instances) ? (
                        <List bulleted>
                            {_.map(instances, instance => (
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
    const { Card, Header, PopupHelp } = Stage.Basic;
    const isChanged = !_.isEmpty(_.filter(types, type => _.size(type.instances) > 0));

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
                    {_.map(types, type => (
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
    const { Header, Table } = Stage.Basic;
    const stepsPresent = !_.isEmpty(steps);

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
                        {_.map(steps, (step, index) => (
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

export default function UpdateDetailsModal({
    deploymentUpdateId,
    executionParameters: providedExecutionParameters,
    open,
    toolbox,
    isPreview,
    onClose,
    onUpdate,
    deploymentUpdate: providedDeploymentUpdate
}) {
    const { useBoolean, useResettableState } = Stage.Hooks;
    const { useEffect } = React;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [deploymentUpdate, setDeploymentUpdate, resetDeploymentUpdate] = useResettableState(
        !_.isEmpty(deploymentUpdateId) ? EMPTY_DEPLOYMENT_UPDATE : providedDeploymentUpdate
    );
    const [executionParameters, setExecutionParameters, resetExecutionParameters] = useResettableState(
        EMPTY_EXECUTION_PARAMETERS
    );

    useEffect(() => {
        if (!_.isEmpty(deploymentUpdateId) && open) {
            setLoading();
            const actions = new Stage.Common.DeploymentUpdatesActions(toolbox);
            actions
                .doGetUpdate(deploymentUpdateId)
                .then(fetchedDeploymentUpdate => {
                    if (_.isEmpty(providedExecutionParameters) && !_.isEmpty(fetchedDeploymentUpdate.execution_id)) {
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

    function getInstances(type) {
        const instances = _.get(deploymentUpdate, `deployment_update_node_instances.${type}_and_related.affected`, []);
        return _.map(instances, instance => instance.id);
    }

    const { ApproveButton, CancelButton, Form, Icon, Modal } = Stage.Basic;

    const effectiveExecutionParameters = !_.isEmpty(providedExecutionParameters)
        ? providedExecutionParameters
        : executionParameters;

    return (
        <div>
            <Modal open={open} onClose={() => onClose()} className="updateDetailsModal">
                <Modal.Header>
                    <Icon name="zoom" /> Deployment update details
                    {isPreview ? ' preview' : deploymentUpdate.id ? ` - ${deploymentUpdate.id}` : ''}
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
                                    instances: _.uniq([...getInstances('extended'), ...getInstances('reduced')])
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
                    {isPreview && <ApproveButton onClick={onUpdate} content="Update" icon="edit" color="green" />}
                </Modal.Actions>
            </Modal>
        </div>
    );
}

UpdateDetailsModal.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired,
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
    onClose: _.noop,
    onUpdate: _.noop
};

Stage.defineCommon({
    name: 'UpdateDetailsModal',
    common: React.memo(UpdateDetailsModal, _.isEqual)
});
