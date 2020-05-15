/**
 * Created by jakubniezgoda on 03/02/2017.
 */

import Actions from './actions';

export default class CreateModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = { ...CreateModal.initialState, open: false };
    }

    static initialState = {
        loading: false,
        groupName: '',
        ldapGroup: '',
        errors: {},
        isAdmin: false
    };

    onApprove() {
        this.submitCreate();
        return false;
    }

    onCancel() {
        this.setState({ open: false });
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            this.setState(CreateModal.initialState);
        }
    }

    submitCreate() {
        const { groupName, isAdmin, ldapGroup } = this.state;
        const { toolbox } = this.props;
        const errors = {};

        if (_.isEmpty(groupName)) {
            errors.groupName = 'Please provide group name';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const actions = new Actions(toolbox);
        actions
            .doCreate(groupName, ldapGroup, Stage.Common.RolesUtil.getSystemRole(isAdmin))
            .then(() => {
                this.setState({ errors: {}, loading: false, open: false });
                toolbox.refresh();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        const { errors, groupName, isAdmin, ldapGroup, loading, open } = this.state;
        const { Modal, Button, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;
        const addButton = <Button content="Add" icon="add user" labelPosition="left" />;

        return (
            <Modal
                trigger={addButton}
                open={open}
                onOpen={() => this.setState({ open: true })}
                onClose={() => this.setState({ open: false })}
            >
                <Modal.Header>
                    <Icon name="add user" /> Add user group
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field error={errors.groupName}>
                            <Form.Input
                                name="groupName"
                                placeholder="Group name"
                                value={groupName}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field error={errors.ldapGroup}>
                            <Form.Input
                                name="ldapGroup"
                                placeholder="LDAP group name"
                                value={ldapGroup}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>

                        <Form.Field error={errors.isAdmin}>
                            <Form.Checkbox
                                label="Admin"
                                name="isAdmin"
                                checked={isAdmin}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={loading}
                        content="Add"
                        icon="add user"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
