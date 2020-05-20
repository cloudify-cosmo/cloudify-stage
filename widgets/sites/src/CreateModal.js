import SiteActions from './SiteActions';
import SiteLocationInput from './SiteLocationInput';

export default class CreateModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = { ...CreateModal.initialState, open: false };
    }

    static initialState = {
        loading: false,
        siteName: '',
        siteLocation: '',
        siteVisibility: Stage.Common.Consts.defaultVisibility,
        errors: {}
    };

    /**
     * propTypes
     *
     * @property {object} toolbox Toolbox object
     * */
    static propTypes = {
        toolbox: PropTypes.object.isRequired
    };

    onApprove() {
        this.createSite();
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

    createSite() {
        const { siteLocation, siteName, siteVisibility } = this.state;
        const { toolbox } = this.props;
        const errors = {};

        if (_.isEmpty(siteName)) {
            errors.siteName = 'Please provide site name';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const actions = new SiteActions(toolbox);
        actions
            .doCreate(siteName, siteVisibility, siteLocation)
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
        const { errors, loading, open, siteName, siteVisibility } = this.state;
        const { ApproveButton, Button, CancelButton, Icon, Form, Modal, VisibilityField } = Stage.Basic;
        const createButton = <Button content="Create" icon="add" labelPosition="left" />;
        const { toolbox } = this.props;

        return (
            <Modal
                trigger={createButton}
                open={open}
                onOpen={() => this.setState({ open: true })}
                onClose={() => this.setState({ open: false })}
            >
                <Modal.Header>
                    <Icon name="add" /> Create site
                    <VisibilityField
                        visibility={siteVisibility}
                        className="rightFloated"
                        onVisibilityChange={visibility => this.setState({ siteVisibility: visibility })}
                    />
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field label="Name" error={errors.siteName} required>
                            <Form.Input name="siteName" value={siteName} onChange={this.handleInputChange.bind(this)} />
                        </Form.Field>
                        <Form.Field error={errors.siteLocation}>
                            <SiteLocationInput onChange={this.handleInputChange.bind(this)} toolbox={toolbox} />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={loading}
                        content="Create"
                        icon="add"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
