/**
 * Created by jakubniezgoda on 03/02/2017.
 */

import Actions from './actions';

export default class UsersModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = UsersModal.initialState;
    }

    static initialState = {
        loading: false,
        users: [],
        errors: {}
    }

    onApprove () {
        this._submitUsers();
        return false;
    }

    onCancel () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState({...UsersModal.initialState, users: nextProps.group.users});
        }
    }

    _submitUsers() {
        // Disable the form
        this.setState({loading: true});

        let usersToAdd = _.difference(this.state.users, this.props.group.users);
        let usersToRemove = _.difference(this.props.group.users, this.state.users);

        var actions = new Actions(this.props.toolbox);
        actions.doHandleUsers(this.props.group.name, usersToAdd, usersToRemove).then(()=>{
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

        var group = Object.assign({},{name:''}, this.props.group);
        var users = Object.assign({},{items:[]}, this.props.users);

        var options = _.map(users.items, item => { return {text: item.username, value: item.username, key: item.username} });

        return (
            <Modal open={this.props.open}>
                <Modal.Header>
                    <Icon name="user"/> Add users to group {group.name}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}>
                        <Form.Field>
                            <Form.Dropdown placeholder='Users' multiple selection options={options} name="users"
                                           value={this.state.users} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} icon="user" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};
