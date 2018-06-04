/**
 * Created by jakubniezgoda on 10/05/2018.
 */

import PropTypes from 'prop-types';
import Actions from './actions';

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
        deploymentUpdateId: PropTypes.string,
        execution: PropTypes.object,
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState({loading: true});
            var actions = new Actions(this.props.toolbox);
            actions.doGetUpdate(nextProps.deploymentUpdateId).then((deploymentUpdate)=>{
                this.setState({loading: false, error: null, deploymentUpdate});
            }).catch((err)=> {
                this.setState({loading: false, error: err.message, deploymentUpdate: UpdateDetailsModal.EMPTY_DEPLOYMENT_UPDATE});
            });
        } else if (this.props.open && !nextProps.open) {
            this.setState({...UpdateDetailsModal.initialState});
        }
    }

    _getDiff(stringA, stringB) {
        let diff = require('diff');
        let difference = diff.diffChars(stringA, stringB);

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
        let {ApproveButton, Form, Header, Icon, Modal, Table, Popup} = Stage.Basic;

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
                                                <Table.HeaderCell>Old</Table.HeaderCell>
                                                <Table.HeaderCell>New</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>

                                        <Table.Body>
                                            {
                                                _.map(allInputs, (input) => {
                                                    let oldValue = _.get(deploymentUpdate.old_inputs, input, '');
                                                    let newValue = _.get(deploymentUpdate.new_inputs, input, '');
                                                    let inputChanged = !_.isEqual(oldValue, newValue);

                                                    return (
                                                        <Table.Row key={input}>
                                                            <Table.Cell>
                                                                {input}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {oldValue}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <span>{newValue} </span>
                                                                {
                                                                    inputChanged &&
                                                                    <Popup>
                                                                        <Popup.Trigger>
                                                                            <Icon name='asterisk' color='red' size='tiny' className='superscripted' />
                                                                        </Popup.Trigger>
                                                                        <Popup.Content>
                                                                            {this._getDiff(oldValue, newValue)}
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
                        <ApproveButton onClick={this.props.onClose} content="Close" color="green"/>
                    </Modal.Actions>
                </Modal>
            </div>

        );
    }
};
