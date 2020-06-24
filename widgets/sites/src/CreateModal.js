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
        this._createSite();
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

    _createSite() {
        const errors = {};

        if (_.isEmpty(this.state.siteName)) {
            errors.siteName = 'Please provide site name';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const actions = new SiteActions(this.props.toolbox);
        actions
            .doCreate(this.state.siteName, this.state.siteVisibility, this.state.siteLocation)
            .then(() => {
                this.setState({ errors: {}, loading: false, open: false });
                this.props.toolbox.refresh();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        const { ApproveButton, Button, CancelButton, Icon, Form, Modal, VisibilityField } = Stage.Basic;
        const createButton = <Button content="Create" icon="add" labelPosition="left" />;

        return (
            <Modal
                trigger={createButton}
                open={this.state.open}
                onOpen={() => this.setState({ open: true })}
                onClose={() => this.setState({ open: false })}
            >
                <Modal.Header>
                    <Icon name="add" /> Create site
                    <VisibilityField
                        visibility={this.state.siteVisibility}
                        className="rightFloated"
                        onVisibilityChange={visibility => this.setState({ siteVisibility: visibility })}
                    />
                </Modal.Header>

                <Modal.Content>
                    <Form
                        loading={this.state.loading}
                        errors={this.state.errors}
                        onErrorsDismiss={() => this.setState({ errors: {} })}
                    >
                        <Form.Field label="Name" error={this.state.errors.siteName} required>
                            <Form.Input
                                name="siteName"
                                value={this.state.siteName}
                                onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>
                        <Form.Field error={this.state.errors.siteLocation}>
                            <SiteLocationInput
                                onChange={this._handleInputChange.bind(this)}
                                toolbox={this.props.toolbox}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={this.state.loading}
                        content="Create"
                        icon="add"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
