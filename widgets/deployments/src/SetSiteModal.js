export default class SetSiteModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = SetSiteModal.initialState;
    }

    static initialState = {
        loading: false,
        errors: {},
        sites: { items: [] }
    };

    /**
     * propTypes
     *
     * @property {object} deployment Deployment object
     * @property {object} toolbox Toolbox object
     * @property {Function} onHide function to be called when the modal is closed
     * @property {boolean} open specifies whether the update modal is displayed
     */
    static propTypes = {
        deployment: PropTypes.object,
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired
    };

    onApprove() {
        this._setSite();
        return false;
    }

    onCancel() {
        this.props.onHide();
        return true;
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            const actions = new Stage.Common.DeploymentActions(this.props.toolbox);
            actions
                .doGetSites()
                .then(sites => {
                    this.setState({
                        ...SetSiteModal.initialState,
                        siteName: this.props.deployment.site_name,
                        detachSite: false,
                        sites
                    });
                })
                .catch(err => {
                    this.setState({ loading: false, error: err.message });
                });
        }
    }

    _setSite() {
        // Disable the form
        this.setState({ loading: true });

        const actions = new Stage.Common.DeploymentActions(this.props.toolbox);
        actions
            .doSetSite(this.props.deployment.id, this.state.siteName, this.state.detachSite)
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
        const site_options = _.map(this.state.sites.items, site => {
            return { text: site.name, value: site.name };
        });

        return (
            <div>
                <Modal open={this.props.open} onClose={() => this.props.onHide()}>
                    <Modal.Header>
                        <Icon name="edit" /> Set the site of deployment {this.props.deployment.id}
                    </Modal.Header>

                    <Modal.Content>
                        <Form
                            loading={this.state.loading}
                            errors={this.state.errors}
                            onErrorsDismiss={() => this.setState({ errors: {} })}
                        >
                            <Form.Field error={this.state.errors.siteName} label="Site name">
                                <Form.Dropdown
                                    search
                                    selection
                                    value={this.state.siteName}
                                    name="siteName"
                                    options={site_options}
                                    onChange={this._handleInputChange.bind(this)}
                                />
                            </Form.Field>
                            <Form.Field className="detachSite">
                                <Form.Checkbox
                                    toggle
                                    label="Detach from the current site"
                                    name="detachSite"
                                    checked={this.state.detachSite}
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
