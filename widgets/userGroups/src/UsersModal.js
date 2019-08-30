/**
 * Created by jakubniezgoda on 03/02/2017.
 */

import Actions from './actions';

export default class UsersModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = UsersModal.initialState;
    }

    static initialState = {
        loading: false,
        users: [],
        errors: {},
        waitingForConfirmation: false
    };

    onApprove() {
        this._submitUsers();
        return false;
    }

    onCancel() {
        this.props.onHide();
        return true;
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState({ ...UsersModal.initialState, users: this.props.group.users });
        }
    }

    _submitUsers() {
        const actions = new Actions(this.props.toolbox);
        const usersToAdd = _.difference(this.state.users, this.props.group.users);
        const usersToRemove = _.difference(this.props.group.users, this.state.users);
        const { waitingForConfirmation } = this.state;

        if (
            !waitingForConfirmation &&
            actions.isLogoutToBePerformed(this.props.group, this.props.groups, usersToRemove)
        ) {
            this.setState({ waitingForConfirmation: true });
            return;
        }

        // Disable the form
        this.setState({ loading: true });

        actions
            .doHandleUsers(this.props.group.name, usersToAdd, usersToRemove)
            .then(() => {
                if (waitingForConfirmation) {
                    this.props.toolbox.getEventBus().trigger('menu.users:logout');
                }
                this.setState({ errors: {}, loading: false });
                this.props.toolbox.refresh();
                this.props.toolbox.getEventBus().trigger('users:refresh');
                this.props.toolbox.getEventBus().trigger('tenants:refresh');
                this.props.onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    _handleInputChange(proxy, field) {
        this.setState({ ...Stage.Basic.Form.fieldNameValue(field), waitingForConfirmation: false });
    }

    render() {
        const { ApproveButton, CancelButton, Form, Icon, Message, Modal } = Stage.Basic;

        const group = { name: '', ...this.props.group };
        const users = { items: [], ...this.props.users };

        const options = _.map(users.items, item => {
            return { text: item.username, value: item.username, key: item.username };
        });

        return (
            <Modal open={this.props.open} onClose={() => this.props.onHide()}>
                <Modal.Header>
                    <Icon name="user" /> Edit users for {group.name}
                </Modal.Header>

                <Modal.Content>
                    {this.state.waitingForConfirmation && (
                        <Message warning onDismiss={() => this.setState({ waitingForConfirmation: false })}>
                            <Message.Header>Confirmation request</Message.Header>
                            You are about to remove yourself from this group. Your administrative privileges will be
                            removed and you will be logged out of the system so the changes take effect. Are you sure
                            you want to continue?
                        </Message>
                    )}
                    <Form
                        loading={this.state.loading}
                        errors={this.state.errors}
                        onErrorsDismiss={() => this.setState({ errors: {} })}
                    >
                        <Form.Field>
                            <Form.Dropdown
                                placeholder="Users"
                                multiple
                                selection
                                options={options}
                                name="users"
                                value={this.state.users}
                                onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton
                        onClick={this.onCancel.bind(this)}
                        disabled={this.state.loading}
                        content={this.state.waitingForConfirmation ? 'No' : undefined}
                    />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={this.state.loading}
                        icon="user"
                        color="green"
                        content={this.state.waitingForConfirmation ? 'Yes' : undefined}
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
