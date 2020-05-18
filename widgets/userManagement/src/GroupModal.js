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
        const { onHide } = this.props;
        onHide();
        return true;
    }

    componentDidUpdate(prevProps) {
        const { open, user } = this.props;
        if (!prevProps.open && open) {
            this.setState({ ...GroupModal.initialState, groups: user.groups });
        }
    }

    submitGroup() {
        const { groups } = this.state;
        const { onHide, toolbox, user } = this.props;
        // Disable the form
        this.setState({ loading: true });

        const groupsToAdd = _.difference(groups, user.groups);
        const groupsToRemove = _.difference(user.groups, groups);

        const actions = new Actions(toolbox);
        actions
            .doHandleGroups(user.username, groupsToAdd, groupsToRemove)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                toolbox.refresh();
                toolbox.getEventBus().trigger('userGroups:refresh');
                toolbox.getEventBus().trigger('tenants:refresh');
                onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        const { errors, loading } = this.state;
        const { onHide, open } = this.props;
        const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

        const user = { username: '', ...user };
        const groups = { items: [], ...groups };

        const options = _.map(groups.items, item => {
            return { text: item.name, value: item.name, key: item.name };
        });

        return (
            <Modal open={open} onClose={() => onHide()}>
                <Modal.Header>
                    <Icon name="user" /> Edit user groups for {user.username}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field>
                            <Form.Dropdown
                                placeholder="Groups"
                                multiple
                                selection
                                options={options}
                                name="groups"
                                value={groups}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={loading} icon="user" color="green" />
                </Modal.Actions>
            </Modal>
        );
    }
}
