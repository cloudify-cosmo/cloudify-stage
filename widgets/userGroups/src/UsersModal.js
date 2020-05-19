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
        this.submitUsers();
        return false;
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    componentDidUpdate(prevProps) {
        const { group, open } = this.props;
        if (!prevProps.open && open) {
            this.setState({ ...UsersModal.initialState, users: group.users });
        }
    }

    submitUsers() {
        const { group, groups, onHide, toolbox } = this.props;
        const { waitingForConfirmation, users } = this.state;
        const actions = new Actions(toolbox);
        const usersToAdd = _.difference(users, group.users);
        const usersToRemove = _.difference(group.users, users);

        if (!waitingForConfirmation && actions.isLogoutToBePerformed(group, groups, usersToRemove)) {
            this.setState({ waitingForConfirmation: true });
            return;
        }

        // Disable the form
        this.setState({ loading: true });

        actions
            .doHandleUsers(group.name, usersToAdd, usersToRemove)
            .then(() => {
                if (waitingForConfirmation) {
                    toolbox.getEventBus().trigger('menu.users:logout');
                }
                this.setState({ errors: {}, loading: false });
                toolbox.refresh();
                toolbox.getEventBus().trigger('users:refresh');
                toolbox.getEventBus().trigger('tenants:refresh');
                onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState({ ...Stage.Basic.Form.fieldNameValue(field), waitingForConfirmation: false });
    }

    render() {
        const { errors, loading, users: usersState, waitingForConfirmation } = this.state;
        const { group: groupProp, onHide, open, users: usersProp } = this.props;
        const { ApproveButton, CancelButton, Form, Icon, Message, Modal } = Stage.Basic;

        const group = { name: '', ...groupProp };
        const users = { items: [], ...usersProp };

        const options = _.map(users.items, item => {
            return { text: item.username, value: item.username, key: item.username };
        });

        return (
            <Modal open={open} onClose={() => onHide()}>
                <Modal.Header>
                    <Icon name="user" /> Edit users for {group.name}
                </Modal.Header>

                <Modal.Content>
                    {waitingForConfirmation && (
                        <Message warning onDismiss={() => this.setState({ waitingForConfirmation: false })}>
                            <Message.Header>Confirmation request</Message.Header>
                            You are about to remove yourself from this group. Your administrative privileges will be
                            removed and you will be logged out of the system so the changes take effect. Are you sure
                            you want to continue?
                        </Message>
                    )}
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field>
                            <Form.Dropdown
                                placeholder="Users"
                                multiple
                                selection
                                options={options}
                                name="users"
                                value={usersState}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton
                        onClick={this.onCancel.bind(this)}
                        disabled={loading}
                        content={waitingForConfirmation ? 'No' : undefined}
                    />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={loading}
                        icon="user"
                        color="green"
                        content={waitingForConfirmation ? 'Yes' : undefined}
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
