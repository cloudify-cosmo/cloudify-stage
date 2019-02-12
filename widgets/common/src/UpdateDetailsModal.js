/**
 * Created by jakubniezgoda on 10/05/2018.
 */

import {diffChars} from 'diff';

export default class UpdateDetailsModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...UpdateDetailsModal.initialState};
    }

    static EMPTY_DEPLOYMENT_UPDATE = {
        old_inputs: {},
        new_inputs: {},
        old_blueprint_id: '',
        new_blueprint_id: '',
        steps: []
    };

    static initialState = {
        loading: false,
        error: null,
        deploymentUpdate: {...UpdateDetailsModal.EMPTY_DEPLOYMENT_UPDATE},
        showOnlyChanged: false
    };

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        isPreview: PropTypes.bool,
        deploymentUpdateId: PropTypes.string,
        deploymentUpdate: PropTypes.object
    };

    static defaultProps = {
        isPreview: false,
        deploymentUpdateId: '',
        deploymentUpdate: {}
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps)
            || !_.isEqual(this.state, nextState);
    }

    componentDidUpdate(prevProps) {
        if (!_.isEmpty(this.props.deploymentUpdateId) && !prevProps.open && this.props.open) {
            this.setState({loading: true});
            let actions = new Stage.Common.DeploymentUpdatesActions(this.props.toolbox);
            actions.doGetUpdate(this.props.deploymentUpdateId).then((deploymentUpdate)=>{
                this.setState({loading: false, error: null, deploymentUpdate});
            }).catch((err)=> {
                this.setState({loading: false, error: err.message, deploymentUpdate: UpdateDetailsModal.EMPTY_DEPLOYMENT_UPDATE});
            });
        } else if (prevProps.open && !this.props.open) {
            this.setState({...UpdateDetailsModal.initialState});
        }
    }

    _getDiff(stringA, stringB) {
        let difference = diffChars(String(stringA), String(stringB));

        return (
            <div>
                {
                    _.map(difference, (part, index) => {
                        let style = part.added ? {color: 'green'} : part.removed ? {color:'red', textDecoration: 'line-through'} : null;
                        return (
                            <span key={`part_${index}`} style={style}>{part.value}</span>
                        );
                    })
                }
            </div>
        );
    }

    areNodeInstancesChanged(deploymentUpdate) {
        const nodeInstancesTypes = _.get(deploymentUpdate, 'deployment_update_node_instances', {});
        let areNodeInstancesChanged = false;

        _.forEach(_.keys(nodeInstancesTypes), type => {
            if (!_.isEmpty(nodeInstancesTypes[type])) {
                areNodeInstancesChanged = true;
            }
        });

        return areNodeInstancesChanged;
    }

    getNodeInstances(deploymentUpdate, type) {
        let {List} = Stage.Basic;
        const typedNodeInstances = _.get(deploymentUpdate, `deployment_update_node_instances.${type}_and_related`, {});

        return !_.isEmpty(typedNodeInstances) && !_.isEmpty(typedNodeInstances['affected'])
            ?
                <List bulleted>
                    {
                        _.map(typedNodeInstances['affected'], (nodeInstance) =>
                            <List.Item key={nodeInstance.id}>
                                <strong>{nodeInstance.id}</strong> ({nodeInstance.node_id})
                            </List.Item>
                        )
                    }
                </List>
            :
                <span>No {type} node instances</span>
    }

    render() {
        let {Card, CancelButton, Form, Header, Icon, List, Modal, Table,
             Popup, ParameterValue, ParameterValueDescription, PopupHelp} = Stage.Basic;
        let {Json} = Stage.Utils;

        const deploymentUpdate = !_.isEmpty(this.props.deploymentUpdateId)
            ? this.state.deploymentUpdate
            : this.props.deploymentUpdate;

        // Inputs
        const newInputs = Array.sort(_.keys(deploymentUpdate.new_inputs));
        const onlyChangedInputs = _.chain(newInputs)
            .filter((inputName) => !_.isEqual(Json.getStringValue(deploymentUpdate.new_inputs[inputName] || ''),
                                              Json.getStringValue(deploymentUpdate.old_inputs[inputName] || '')))
            .uniq()
            .value();
        const inputsChanged = !_.isEqual(deploymentUpdate.old_inputs, deploymentUpdate.new_inputs);

        // Blueprint
        const oldBlueprint = deploymentUpdate.old_blueprint_id;
        const newBlueprint = deploymentUpdate.new_blueprint_id;
        const blueprintChanged = oldBlueprint !== newBlueprint;

        // Steps
        const steps = deploymentUpdate.steps;
        const stepsPresent = !_.isEmpty(steps);

        // Node Instances
        const nodeInstancesTypes = [
            {name: 'added', icon: 'plus'},
            {name: 'removed', icon: 'minus'},
            {name: 'extended', icon: 'expand'},
            {name: 'reduced', icon: 'compress'}
        ];
        const nodeInstancesChanged = this.areNodeInstancesChanged(deploymentUpdate);

        return (
            <div>
                <Modal open={this.props.open} onClose={()=>this.props.onClose()} className='updateDetailsModal'>
                    <Modal.Header>
                        <Icon name='zoom' /> Deployment Update details
                        {
                            this.props.isPreview
                                ? ' preview'
                                : deploymentUpdate.id ? ` - ${deploymentUpdate.id}` : ''
                        }
                    </Modal.Header>

                    <Modal.Content scrolling>
                        <Form loading={this.state.loading} errors={this.state.errors}
                              onErrorsDismiss={() => this.setState({errors: {}})}>

                            <Header>
                                Blueprint
                            </Header>

                            {
                                blueprintChanged
                                ? <span>Changed from <strong>{oldBlueprint}</strong> into <strong>{newBlueprint}</strong>.</span>
                                : <span>Not changed.</span>
                            }

                            <Header>
                                {
                                    inputsChanged &&
                                    <Form.Checkbox name='showOnlyChanged' toggle label='Show only changed'
                                                   help='Show only inputs which have different values'
                                                   className='rightFloated' checked={this.state.showOnlyChanged}
                                                   onChange={() => this.setState({showOnlyChanged: !this.state.showOnlyChanged})} />
                                }
                                Inputs
                                {
                                    inputsChanged &&
                                    <Header.Subheader>
                                        See details:&nbsp;
                                        <PopupHelp content={
                                            <div>
                                                <div>
                                                    To show only changed inputs use <strong>Show only changed</strong> toggle.
                                                </div>
                                                <br/>
                                                <div>
                                                    To see difference between old and new inputs hover over&nbsp;
                                                    <Icon name='asterisk' color='red' size='tiny' className='superscripted' />
                                                    &nbsp;character on the right side of changed input
                                                    to open popup with change details.
                                                </div>
                                                <br/>
                                                <div>
                                                    Inside popup you will see text in:
                                                    <List bulleted>
                                                        <List.Item>
                                                            <span style={{color: 'green'}}>green</span> - added characters
                                                        </List.Item>
                                                        <List.Item>
                                                            <span style={{color: 'red'}}>red</span> - removed characters
                                                        </List.Item>
                                                        <List.Item>
                                                            <span style={{color: 'black'}}>black</span> - unchanged characters
                                                        </List.Item>
                                                    </List>
                                                </div>
                                            </div>
                                        } />
                                    </Header.Subheader>
                                }
                            </Header>

                            {
                                inputsChanged
                                ?
                                    <Table striped>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell width={4}>Input</Table.HeaderCell>
                                                <Table.HeaderCell width={6}>Old <ParameterValueDescription /></Table.HeaderCell>
                                                <Table.HeaderCell width={6}>New <ParameterValueDescription /></Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>

                                        <Table.Body>
                                            {
                                                _.map(this.state.showOnlyChanged ? onlyChangedInputs : newInputs,
                                                    (input) => {
                                                    const oldValue = _.get(deploymentUpdate.old_inputs, input, '');
                                                    const oldValueString = Json.getStringValue(oldValue);
                                                    const newValue = _.get(deploymentUpdate.new_inputs, input, '');
                                                    const newValueString = Json.getStringValue(newValue);
                                                    const inputChanged = !_.isEqual(oldValueString, newValueString);

                                                    return (
                                                        <Table.Row key={input}>
                                                            <Table.Cell>
                                                                {input}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <ParameterValue value={oldValue} showCopyButton={false} />
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <ParameterValue value={newValue} showCopyButton={false} />
                                                                {
                                                                    inputChanged &&
                                                                    <Popup>
                                                                        <Popup.Trigger>
                                                                            <Icon name='asterisk' color='red' size='tiny' className='superscripted' />
                                                                        </Popup.Trigger>
                                                                        <Popup.Content>
                                                                            {this._getDiff(oldValueString, newValueString)}
                                                                        </Popup.Content>
                                                                    </Popup>
                                                                }
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    );
                                                })
                                            }
                                        </Table.Body>
                                    </Table>
                                : <span>No inputs changed.</span>
                            }

                            <Header>
                                Node Instances
                                {
                                    nodeInstancesChanged &&
                                    <Header.Subheader>
                                        See details:&nbsp;
                                        <PopupHelp content={
                                            <div>
                                                Four different categories present added/removed/extended/reduced node instances.
                                                Bulleted list contain modified node instance ID and node ID in round brackets.
                                            </div>
                                        } />
                                    </Header.Subheader>
                                }
                            </Header>

                            {
                                nodeInstancesChanged
                                ?
                                    <Card.Group itemsPerRow={2}>
                                        {
                                            _.map(nodeInstancesTypes, (type) =>
                                                <Card key={type.name}>
                                                    <Card.Content>
                                                        <Card.Header>
                                                            <Icon name={type.icon} />
                                                            {_.capitalize(type.name)}
                                                        </Card.Header>
                                                        <Card.Description>
                                                            {this.getNodeInstances(deploymentUpdate, type.name)}
                                                        </Card.Description>
                                                    </Card.Content>
                                                </Card>
                                            )
                                        }
                                    </Card.Group>
                                :
                                    <span>No node instances changed.</span>
                            }

                            <Header>
                                Steps
                            </Header>
                            {
                                stepsPresent
                                ?
                                    <Table striped>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell>Action</Table.HeaderCell>
                                                <Table.HeaderCell>Entity Type</Table.HeaderCell>
                                                <Table.HeaderCell>Entity ID</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>

                                        <Table.Body>
                                            {
                                                _.map(steps, (step) =>
                                                    <Table.Row key={step.id}>
                                                        <Table.Cell>
                                                            {step.action}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {step.entity_type}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {step.entity_id}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                )
                                            }
                                        </Table.Body>
                                    </Table>
                                :
                                    <span>No action steps.</span>
                            }

                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.props.onClose} content="Close"  />
                    </Modal.Actions>
                </Modal>
            </div>

        );
    }
};

Stage.defineCommon({
    name: 'UpdateDetailsModal',
    common: UpdateDetailsModal
});
