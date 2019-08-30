import SiteActions from './SiteActions';

export default class UpdateModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = UpdateModal.initialState;
    }

    static initialState = {
        loading: false,
        errors: {}
    };

    /**
     * propTypes
     *
     * @property {object} site Site object
     * @property {object} toolbox Toolbox object
     * @property {Function} onHide function to be called when the modal is closed
     * @property {boolean} open specifies whether the update modal is displayed
     */
    static propTypes = {
        site: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired
    };

    onApprove() {
        this._updateSite();
        return false;
    }

    onCancel() {
        this.props.onHide();
        return true;
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState({
                ...UpdateModal.initialState,
                siteNewName: this.props.site.name,
                siteLocation: this.props.site.location || ''
            });
        }
    }

    _updateSite() {
        // Disable the form
        this.setState({ loading: true });

        const actions = new SiteActions(this.props.toolbox);
        actions
            .doUpdate(this.props.site.name, null, this.state.siteLocation, this.state.siteNewName)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                this.props.toolbox.refresh();
                this.props.onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

        return (
            <div>
                <Modal open={this.props.open} onClose={() => this.props.onHide()}>
                    <Modal.Header>
                        <Icon name="edit" /> Update site {this.props.site.name}
                    </Modal.Header>

                    <Modal.Content>
                        <Form
                            loading={this.state.loading}
                            errors={this.state.errors}
                            onErrorsDismiss={() => this.setState({ errors: {} })}
                        >
                            <Form.Field error={this.state.errors.siteNewName}>
                                <Form.Input
                                    label="Name"
                                    name="siteNewName"
                                    value={this.state.siteNewName}
                                    onChange={this._handleInputChange.bind(this)}
                                />
                            </Form.Field>
                            <Form.Field error={this.state.errors.siteLocation}>
                                <Form.Input
                                    label="Location"
                                    name="siteLocation"
                                    value={this.state.siteLocation}
                                    placeholder="latitude, longitude (32.166369, 34.810893)"
                                    onChange={this._handleInputChange.bind(this)}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                        <ApproveButton
                            onClick={this.onApprove.bind(this)}
                            disabled={this.state.loading}
                            content="Update"
                            icon="edit"
                            color="green"
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}
