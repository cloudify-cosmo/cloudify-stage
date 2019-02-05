/**
 * Created by jakubniezgoda on 10/05/2018.
 */

import {diffChars} from 'diff';

export default class UpdateDetailsModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...UpdateDetailsModal.initialState};
    }

    static initialState = {
        loading: false,
        error: null,
        deploymentUpdate: {...UpdateDetailsModal.EMPTY_DEPLOYMENT_UPDATE}
    };

    static EMPTY_DEPLOYMENT_UPDATE = {
        old_inputs: {},
        new_inputs: {},
        old_blueprint_id: '',
        new_blueprint_id: ''
    };

    static propTypes = {
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        deploymentUpdateId: PropTypes.string
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
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

    render() {
        let {CancelButton, Form, Header, Icon, Modal, Table, Popup, ParameterValue, ParameterValueDescription} = Stage.Basic;
        let {JsonUtils} = Stage.Common;

        let deploymentUpdate = this.state.deploymentUpdate;
        let oldInputs = Array.sort(_.keys(deploymentUpdate.old_inputs));
        let newInputs = Array.sort(_.keys(deploymentUpdate.new_inputs));
        let allInputs = _.uniq([...oldInputs, ...newInputs]);
        let inputsChanged = !_.isEqual(deploymentUpdate.old_inputs, deploymentUpdate.new_inputs);

        let oldBlueprint = deploymentUpdate.old_blueprint_id;
        let newBlueprint = deploymentUpdate.new_blueprint_id;
        let blueprintChanged = oldBlueprint !== newBlueprint;

        return (
            <div>
                <Modal open={this.props.open} onClose={()=>this.props.onClose()} className='updateDetailsModal'>
                    <Modal.Header>
                        Update details
                    </Modal.Header>

                    <Modal.Content>
                        <Form loading={this.state.loading} errors={this.state.errors}
                              onErrorsDismiss={() => this.setState({errors: {}})}>

                            <Header size="tiny">
                                Blueprint
                            </Header>

                            {
                                blueprintChanged
                                ? <span>Changed from <strong>{oldBlueprint}</strong> into <strong>{newBlueprint}</strong>.</span>
                                : <span>Not changed.</span>
                            }

                            <Header size="tiny">
                                Inputs
                                {
                                    inputsChanged &&
                                    <Header.Subheader>
                                        To see difference between old and new inputs hover over&nbsp;
                                        <Icon name='asterisk' color='red' size='tiny' className='superscripted' />
                                    </Header.Subheader>
                                }
                            </Header>

                            {
                                inputsChanged
                                ?
                                    <Table>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell></Table.HeaderCell>
                                                <Table.HeaderCell>Old <ParameterValueDescription /></Table.HeaderCell>
                                                <Table.HeaderCell>New <ParameterValueDescription /></Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>

                                        <Table.Body>
                                            {
                                                _.map(allInputs, (input) => {
                                                    let oldValue = _.get(deploymentUpdate.old_inputs, input, '');
                                                    let oldValueString = JsonUtils.getStringValue(oldValue);
                                                    let newValue = _.get(deploymentUpdate.new_inputs, input, '');
                                                    let newValueString = JsonUtils.getStringValue(newValue);
                                                    let inputChanged = !_.isEqual(oldValueString, newValueString);

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
