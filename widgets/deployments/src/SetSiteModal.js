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
        deployment: PropTypes.shape({ id: PropTypes.string, site_name: PropTypes.string }).isRequired,
        toolbox: Stage.Common.PropTypes.Toolbox.isRequired,
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired
    };

    onApprove() {
        this.setSite();
        return false;
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    componentDidUpdate(prevProps) {
        const { deployment, open, toolbox } = this.props;
        if (!prevProps.open && open) {
            const actions = new Stage.Common.DeploymentActions(toolbox);
            actions
                .doGetSites()
                .then(sites => {
                    this.setState({
                        ...SetSiteModal.initialState,
                        siteName: deployment.site_name,
                        detachSite: false,
                        sites
                    });
                })
                .catch(err => {
                    this.setState({ loading: false });
                });
        }
    }

    setSite() {
        const { detachSite, siteName } = this.state;
        const { deployment, onHide, toolbox } = this.props;
        // Disable the form
        this.setState({ loading: true });

        const actions = new Stage.Common.DeploymentActions(toolbox);
        actions
            .doSetSite(deployment.id, siteName, detachSite)
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
        const { detachSite, errors, loading, siteName, sites } = this.state;
        const { deployment, onHide, open } = this.props;
        const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;
        const site_options = _.map(sites.items, site => {
            return { text: site.name, value: site.name };
        });

        return (
            <div>
                <Modal open={open} onClose={() => onHide()}>
                    <Modal.Header>
                        <Icon name="edit" /> Set the site of deployment {deployment.id}
                    </Modal.Header>

                    <Modal.Content>
                        <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                            <Form.Field error={errors.siteName} label="Site name">
                                <Form.Dropdown
                                    search
                                    selection
                                    value={siteName}
                                    name="siteName"
                                    options={site_options}
                                    onChange={this.handleInputChange.bind(this)}
                                />
                            </Form.Field>
                            <Form.Field className="detachSite">
                                <Form.Checkbox
                                    toggle
                                    label="Detach from the current site"
                                    name="detachSite"
                                    checked={detachSite}
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
