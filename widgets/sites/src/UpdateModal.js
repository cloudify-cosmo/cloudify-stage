import SiteActions from './SiteActions';
import SiteLocationInput from './SiteLocationInput';

export default class UpdateModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = UpdateModal.initialState;
    }

    static initialState = {
        loading: false,
        errors: {},
        siteNewName: ''
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
        this.updateSite();
        return false;
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    componentDidUpdate(prevProps) {
        const { open, site } = this.props;
        if (!prevProps.open && open) {
            this.setState({
                ...UpdateModal.initialState,
                siteNewName: site.name,
                siteLocation: site.location || ''
            });
        }
    }

    updateSite() {
        const { siteLocation, siteNewName } = this.state;
        const { onHide, site, toolbox } = this.props;
        // Disable the form
        this.setState({ loading: true });

        const actions = new SiteActions(toolbox);
        actions
            .doUpdate(site.name, null, siteLocation, siteNewName)
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
        const { errors, loading, siteLocation, siteNewName } = this.state;
        const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;
        const { toolbox, onHide, open, site } = this.props;

        return (
            <div>
                <Modal open={open} onClose={() => onHide()}>
                    <Modal.Header>
                        <Icon name="edit" /> Update site {site.name}
                    </Modal.Header>

                    <Modal.Content>
                        <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                            <Form.Field error={errors.siteNewName}>
                                <Form.Input
                                    label="Name"
                                    name="siteNewName"
                                    value={siteNewName}
                                    onChange={this.handleInputChange.bind(this)}
                                />
                            </Form.Field>
                            <Form.Field error={errors.siteLocation}>
                                <SiteLocationInput
                                    value={siteLocation}
                                    onChange={this.handleInputChange.bind(this)}
                                    toolbox={toolbox}
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
