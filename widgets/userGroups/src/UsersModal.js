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
        this.refs.usersForm.submit();
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.show && nextProps.show) {
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
        var {Modal, Icon, Form} = Stage.Basic;

        var group = Object.assign({},{name:''}, this.props.group);
        var users = Object.assign({},{items:[]}, this.props.users);

        var options = _.map(users.items, item => { return {text: item.username, value: item.username, key: item.username} });

        return (
            <Modal show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)} loading={this.state.loading}>
                <Modal.Header>
                    <Icon name="user"/> Add users to group {group.name}
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={this._submitUsers.bind(this)} errors={this.state.errors} ref="usersForm">
                        <Form.Field>
                            <Form.Dropdown placeholder='Users' multiple search selection options={options} name="users"
                                           value={this.state.users} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Modal.Cancel/>
                    <Modal.Approve label="Save" icon="user" className="green"/>
                </Modal.Footer>
            </Modal>
        );
    }
};
