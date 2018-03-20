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
        errors: {},
        waitingForConfirmation: false
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
        let actions = new Actions(this.props.toolbox);
        let usersToAdd = _.difference(this.state.users, this.props.group.users);
        let usersToRemove = _.difference(this.props.group.users, this.state.users);
        let waitingForConfirmation = this.state.waitingForConfirmation;

        if (!waitingForConfirmation && actions.isLogoutToBePerformed(this.props.group, this.props.groups, usersToRemove)) {
            this.setState({waitingForConfirmation: true});
            return;
        }

        // Disable the form
        this.setState({loading: true});

        actions.doHandleUsers(this.props.group.name, usersToAdd, usersToRemove).then(()=>{
            if (waitingForConfirmation) {
                this.props.toolbox.getEventBus().trigger('menu.users:logout');
            }
            this.setState({errors: {}, loading: false});
            this.props.toolbox.refresh();
            this.props.toolbox.getEventBus().trigger('users:refresh');
            this.props.toolbox.getEventBus().trigger('tenants:refresh');
            this.props.onHide();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState({...Stage.Basic.Form.fieldNameValue(field), waitingForConfirmation: false});
    }

    render() {
        var {ApproveButton, CancelButton, Form, Icon, Message, Modal} = Stage.Basic;

        var group = Object.assign({},{name:''}, this.props.group);
        var users = Object.assign({},{items:[]}, this.props.users);

        var options = _.map(users.items, item => { return {text: item.username, value: item.username, key: item.username} });

        return (
            <Modal open={this.props.open} onClose={()=>this.props.onHide()}>
                <Modal.Header>
                    <Icon name="user"/> Edit users for {group.name}
                </Modal.Header>

                <Modal.Content>
                    {
                        this.state.waitingForConfirmation &&
                        <Message warning onDismiss={() => this.setState({waitingForConfirmation: false})}>
                            <Message.Header>Confirmation request</Message.Header>
                            You are about to remove current user from this group.
                            This action will disable administrative rights for that user.
                            If you are sure you want to make such change and log out
                            then press <strong>Save</strong> button once again.
                        </Message>
                    }
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>
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
