export default class SetSiteModal extends React.Component {
    static initialState = {
        loading: false,
        errors: {},
        sites: { items: [] }
    };

    constructor(props, context) {
        super(props, context);

        this.state = SetSiteModal.initialState;
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
                .catch(() => {
                    this.setState({ loading: false });
                });
        }
    }

    onApprove = () => {
        this.setSite();
        return false;
    };

    onCancel = () => {
        const { onHide } = this.props;
        onHide();
        return true;
    };

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

    handleInputChange = (proxy, field) => {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    };

    render() {
        const { detachSite, errors, loading, siteName, sites } = this.state;
        const { deployment, onHide, open } = this.props;
        const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;
        const siteOptions = _.map(sites.items, site => {
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
                                    options={siteOptions}
                                    onChange={this.handleInputChange}
                                />
                            </Form.Field>
                            <Form.Field className="detachSite">
                                <Form.Checkbox
                                    toggle
                                    label="Detach from the current site"
                                    name="detachSite"
                                    checked={detachSite}
                                    onChange={this.handleInputChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.onCancel} disabled={loading} />
                        <ApproveButton
                            onClick={this.onApprove}
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

/**
 * @property {object} deployment Deployment object
 * @property {object} toolbox Toolbox object
 * @property {Function} onHide function to be called when the modal is closed
 * @property {boolean} open specifies whether the update modal is displayed
 */
SetSiteModal.propTypes = {
    deployment: PropTypes.shape({ id: PropTypes.string, site_name: PropTypes.string }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired
};
