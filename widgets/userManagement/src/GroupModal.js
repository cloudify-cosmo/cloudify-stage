/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';

export default class GroupModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = GroupModal.initialState;
    }

    static initialState = {
        loading: false,
        groups: [],
        errors: {}
    };

    onApprove() {
        this.submitGroup();
        return false;
    }

    onCancel() {
        this.props.onHide();
        return true;
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState({ ...GroupModal.initialState, groups: this.props.user.groups });
        }
    }

    submitGroup() {
        // Disable the form
        this.setState({ loading: true });

        const groupsToAdd = _.difference(this.state.groups, this.props.user.groups);
        const groupsToRemove = _.difference(this.props.user.groups, this.state.groups);

        const actions = new Actions(this.props.toolbox);
        actions
            .doHandleGroups(this.props.user.username, groupsToAdd, groupsToRemove)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                this.props.toolbox.refresh();
                this.props.toolbox.getEventBus().trigger('userGroups:refresh');
                this.props.toolbox.getEventBus().trigger('tenants:refresh');
                this.props.onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

        const user = { username: '', ...this.props.user };
        const groups = { items: [], ...this.props.groups };

        const options = _.map(groups.items, item => {
            return { text: item.name, value: item.name, key: item.name };
        });

        return (
            <Modal open={this.props.open} onClose={() => this.props.onHide()}>
                <Modal.Header>
                    <Icon name="user" /> Edit user groups for {user.username}
                </Modal.Header>

                <Modal.Content>
                    <Form
                        loading={this.state.loading}
                        errors={this.state.errors}
                        onErrorsDismiss={() => this.setState({ errors: {} })}
                    >
                        <Form.Field>
                            <Form.Dropdown
                                placeholder="Groups"
                                multiple
                                selection
                                options={options}
                                name="groups"
                                value={this.state.groups}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={this.state.loading}
                        icon="user"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
