/**
 * Created by pposel on 31/01/2017.
 */

export default class RoleModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = RoleModal.initialState;
    }

    static initialState = {
        loading: false,
        role: '',
        errors: {}
    };

    onApprove() {
        this.submitRole();
        return false;
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    componentDidUpdate(prevProps) {
        const { open, resource } = this.props;
        if (!prevProps.open && open) {
            this.setState({ ...RoleModal.initialState, role: resource.role });
        }
    }

    submitRole() {
        const { role } = this.state;
        const { onHide, onSetRole, resource, toolbox } = this.props;
        const errors = {};

        if (_.isEmpty(role)) {
            errors.role = 'Please provide a role';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        onSetRole(resource.name, role)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                toolbox.refresh();
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
        const { errors, loading, role } = this.state;
        const { onHide, open, resource: resourceProp, roles } = this.props;
        const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

        const resource = { name: '', ...resourceProp };

        return (
            <Modal open={open} onClose={() => onHide()} className="roleModal">
                <Modal.Header>
                    <Icon name="male" /> Set role for {resource.name}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field error={errors.role}>
                            <Form.Dropdown
                                selection
                                name="role"
                                placeholder="Role"
                                options={roles}
                                value={role}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={loading} icon="male" color="green" />
                </Modal.Actions>
            </Modal>
        );
    }
}

Stage.defineCommon({
    name: 'RoleModal',
    common: RoleModal
});
