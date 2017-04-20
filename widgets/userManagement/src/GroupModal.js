/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';

export default class GroupModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = GroupModal.initialState;
    }

    static initialState = {
        loading: false,
        groups: [],
        errors: {}
    }

    onApprove () {
        this._submitGroup();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState({...GroupModal.initialState, groups: nextProps.user.groups});
        }
    }

    _submitGroup() {
        // Disable the form
        this.setState({loading: true});

        let groupsToAdd = _.difference(this.state.groups, this.props.user.groups);
        let groupsToRemove = _.difference(this.props.user.groups, this.state.groups);

        var actions = new Actions(this.props.toolbox);
        actions.doHandleGroups(this.props.user.username, groupsToAdd, groupsToRemove).then(()=>{
            this.setState({loading: false});
            this.props.toolbox.refresh();
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;

        var user = Object.assign({},{username:""}, this.props.user);
        var groups = Object.assign({},{items:[]}, this.props.groups);

        var options = _.map(groups.items, item => { return {text: item.name, value: item.name, key: item.name} });

        return (
            <Modal open={this.props.open}>
                <Modal.Header>
                    <Icon name="user"/> Edit user groups for {user.username}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}>
                        <Form.Field>
                            <Form.Dropdown placeholder='Groups' multiple selection options={options} name="groups"
                                           value={this.state.groups} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} icon="user" color="green" />
                </Modal.Actions>
            </Modal>
        );
    }
};
