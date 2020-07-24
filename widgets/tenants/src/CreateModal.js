/**
 * Created by jakubniezgoda on 01/02/2017.
 */

import Actions from './actions';

export default class CreateModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = { ...CreateModal.initialState, open: false };
    }

    static initialState = {
        loading: false,
        tenantName: '',
        errors: {}
    };

    onApprove() {
        this.createTenant();
        return false;
    }

    onCancel() {
        this.setState({ open: false });
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        const { open } = this.state;
        if (!prevState.open && open) {
            this.setState(CreateModal.initialState);
        }
    }

    createTenant() {
        const { tenantName } = this.state;
        const { toolbox } = this.props;
        const errors = {};

        if (_.isEmpty(tenantName)) {
            errors.tenantName = 'Please provide tenant name';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const actions = new Actions(toolbox);
        actions
            .doCreate(tenantName)
            .then(tenant => {
                this.setState({ errors: {}, loading: false, open: false });
                toolbox.refresh();
                toolbox.getEventBus().trigger('menu.tenants:refresh');
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        const { errors, loading, open, tenantName } = this.state;
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
                    <Icon name="add user" /> Add tenant
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field error={errors.tenantName}>
                            <Form.Input
                                name="tenantName"
                                placeholder="Tenant name"
                                value={tenantName}
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

CreateModal.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
