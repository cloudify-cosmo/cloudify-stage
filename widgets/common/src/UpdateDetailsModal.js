/**
 * Created by jakubniezgoda on 10/05/2018.
 */

import { diffChars } from 'diff';

function BlueprintSection(props) {
    const { Header } = Stage.Basic;
    const isChanged = props.oldBlueprint !== props.newBlueprint;

    return (
        <>
            <Header>Blueprint</Header>

            {isChanged ? (
                <span>
                    Changed from <strong>{props.oldBlueprint}</strong> into <strong>{props.newBlueprint}</strong>.
                </span>
            ) : (
                <span>Not changed.</span>
            )}
        </>
    );
}

class InputsSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showOnlyChanged: false
        };
    }

    render() {
        const { Form, Header, Icon, List, Popup, PopupHelp, Table } = Stage.Basic;
        const { ParameterValue, ParameterValueDescription } = Stage.Common;
        const { Json } = Stage.Utils;

        const newInputs = Array.sort(_.keys(this.props.newInputs));
        const onlyChangedInputs = _.chain(newInputs)
            .filter(
                inputName =>
                    !_.isEqual(
                        Json.getStringValue(this.props.newInputs[inputName] || ''),
                        Json.getStringValue(this.props.oldInputs[inputName] || '')
                    )
            )
            .uniq()
            .value();
        const inputsChanged = !_.isEqual(this.props.oldInputs, this.props.newInputs);

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
                            checked={this.state.showOnlyChanged}
                            onChange={() => this.setState({ showOnlyChanged: !this.state.showOnlyChanged })}
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
                            {_.map(this.state.showOnlyChanged ? onlyChangedInputs : newInputs, input => {
                                const oldValue = _.get(this.props.oldInputs, input, '');
                                const oldValueString = Json.getStringValue(oldValue);
                                const newValue = _.get(this.props.newInputs, input, '');
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

function NodeInstancesCard(props) {
    const { Card, Icon, Label, List } = Stage.Basic;

    return (
        <Card key={props.name} color={props.color}>
            <Card.Content>
                <Card.Header>
                    <Icon name={props.icon} color={props.color} />
                    {_.capitalize(_.lowerCase(props.name))}
                    {props.action && (
                        <Label className="right floated">
                            {props.action}: {props.workflowSkipped ? 'No' : 'Yes'}
                        </Label>
                    )}
                </Card.Header>
                <Card.Description>
                    {!_.isEmpty(props.instances) ? (
                        <List bulleted>
                            {_.map(props.instances, instance => (
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

function NodeInstancesSection(props) {
    const { Card, Header, PopupHelp } = Stage.Basic;
    const isChanged = !_.isEmpty(_.filter(props.types, type => _.size(type.instances) > 0));

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
                    {_.map(props.types, type => (
                        <NodeInstancesCard key={type.name} {...type} />
                    ))}
                </Card.Group>
            ) : (
                <span>No node instances changed.</span>
            )}
        </>
    );
}

function StepsSection(props) {
    const { Header, Table } = Stage.Basic;
    const stepsPresent = !_.isEmpty(props.steps);

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
                        {_.map(props.steps, (step, index) => (
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

export default class UpdateDetailsModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = { ...UpdateDetailsModal.initialState };
    }

    static EMPTY_DEPLOYMENT_UPDATE = {
        old_inputs: {},
        new_inputs: {},
        old_blueprint_id: '',
        new_blueprint_id: '',
        steps: []
    };

    static EMPTY_EXECUTION_PARAMETERS = {
        skip_install: false,
        skip_uninstall: false,
        skip_reinstall: false,
        reinstall_list: []
    };

    static initialState = {
        loading: false,
        error: null,
        deploymentUpdate: { ...UpdateDetailsModal.EMPTY_DEPLOYMENT_UPDATE },
        executionParameters: { ...UpdateDetailsModal.EMPTY_EXECUTION_PARAMETERS }
    };

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        isPreview: PropTypes.bool,
        deploymentUpdateId: PropTypes.string,
        deploymentUpdate: PropTypes.object,
        executionParameters: PropTypes.object,
        onClose: PropTypes.func,
        onUpdate: PropTypes.func
    };

    static defaultProps = {
        isPreview: false,
        deploymentUpdateId: '',
        deploymentUpdate: {},
        executionParameters: {},
        onClose: _.noop,
        onUpdate: _.noop
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    componentDidUpdate(prevProps) {
        if (!_.isEmpty(this.props.deploymentUpdateId) && !prevProps.open && this.props.open) {
            this.setState({ loading: true });
            const actions = new Stage.Common.DeploymentUpdatesActions(this.props.toolbox);
            actions
                .doGetUpdate(this.props.deploymentUpdateId)
                .then(deploymentUpdate => {
                    if (_.isEmpty(this.props.executionParameters) && !_.isEmpty(deploymentUpdate.execution_id)) {
                        actions
                            .doGetExecutionParameters(deploymentUpdate.execution_id)
                            .then(({ parameters: executionParameters }) =>
                                this.setState({ loading: false, error: null, deploymentUpdate, executionParameters })
                            )
                            .catch(err =>
                                this.setState({
                                    loading: false,
                                    error: err.message,
                                    deploymentUpdate: UpdateDetailsModal.EMPTY_DEPLOYMENT_UPDATE
                                })
                            );
                    } else {
                        this.setState({ loading: false, error: null, deploymentUpdate });
                    }
                })
                .catch(err => {
                    this.setState({
                        loading: false,
                        error: err.message,
                        deploymentUpdate: UpdateDetailsModal.EMPTY_DEPLOYMENT_UPDATE
                    });
                });
        } else if (prevProps.open && !this.props.open) {
            this.setState({ ...UpdateDetailsModal.initialState });
        }
    }

    getInstances(deploymentUpdate, type) {
        const instances = _.get(deploymentUpdate, `deployment_update_node_instances.${type}_and_related.affected`, []);
        return _.map(instances, instance => instance.id);
    }

    render() {
        const { ApproveButton, CancelButton, Form, Icon, Modal } = Stage.Basic;

        const deploymentUpdate = !_.isEmpty(this.props.deploymentUpdateId)
            ? this.state.deploymentUpdate
            : this.props.deploymentUpdate;
        const executionParameters = !_.isEmpty(this.props.executionParameters)
            ? this.props.executionParameters
            : this.state.executionParameters;

        return (
            <div>
                <Modal open={this.props.open} onClose={() => this.props.onClose()} className="updateDetailsModal">
                    <Modal.Header>
                        <Icon name="zoom" /> Deployment update details
                        {this.props.isPreview ? ' preview' : deploymentUpdate.id ? ` - ${deploymentUpdate.id}` : ''}
                    </Modal.Header>

                    <Modal.Content scrolling>
                        <Form
                            loading={this.state.loading}
                            errors={this.state.errors}
                            onErrorsDismiss={() => this.setState({ errors: {} })}
                        >
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
                                        workflowSkipped: executionParameters.skip_install,
                                        instances: this.getInstances(deploymentUpdate, 'added')
                                    },
                                    {
                                        name: 'remove',
                                        icon: 'minus',
                                        color: 'red',
                                        action: 'Uninstall',
                                        workflowSkipped: executionParameters.skip_uninstall,
                                        instances: this.getInstances(deploymentUpdate, 'removed')
                                    },
                                    {
                                        name: 'modify',
                                        icon: 'edit',
                                        color: 'teal',
                                        action: 'Reinstall',
                                        workflowSkipped: executionParameters.skip_reinstall,
                                        instances: _.uniq([
                                            ...this.getInstances(deploymentUpdate, 'extended'),
                                            ...this.getInstances(deploymentUpdate, 'reduced')
                                        ])
                                    },
                                    {
                                        name: 'explicit_reinstall',
                                        icon: 'sync',
                                        color: 'blue',
                                        instances: executionParameters.reinstall_list
                                    }
                                ]}
                            />

                            <StepsSection steps={deploymentUpdate.steps} />
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.props.onClose} content="Close" />
                        {this.props.isPreview && (
                            <ApproveButton onClick={this.props.onUpdate} content="Update" icon="edit" color="green" />
                        )}
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

Stage.defineCommon({
    name: 'UpdateDetailsModal',
    common: UpdateDetailsModal
});
