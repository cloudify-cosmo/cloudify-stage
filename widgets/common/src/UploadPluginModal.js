/**
 * Created by kinneretzin on 05/10/2016.
 */

class UploadPluginModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = { ...UploadPluginModal.initialState };
    }

    static propTypes = {
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    static initialState = {
        loading: false,
        wagonUrl: '',
        wagonFile: null,
        yamlUrl: '',
        yamlFile: null,
        iconUrl: '',
        iconFile: null,
        errors: {},
        visibility: Stage.Common.Consts.defaultVisibility
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState(UploadPluginModal.initialState);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.open, nextProps.open) || !_.isEqual(this.state, nextState);
    }

    uploadPlugin() {
        const { wagonUrl, yamlUrl, iconUrl } = this.state;

        const errors = {};

        if (!this.state.wagonFile) {
            if (_.isEmpty(wagonUrl)) {
                errors.wagonUrl = 'Please select wagon file or provide URL to wagon file';
            } else if (!Stage.Utils.Url.isUrl(wagonUrl)) {
                errors.wagonUrl = 'Please provide valid URL for wagon file';
            }
        }

        if (!this.state.yamlFile) {
            if (_.isEmpty(yamlUrl)) {
                errors.yamlUrl = 'Please select YAML file or provide URL to YAML file';
            } else if (!Stage.Utils.Url.isUrl(yamlUrl)) {
                errors.yamlUrl = 'Please provide valid URL for YAML file';
            }
        }

        if (!this.state.iconFile && !_.isEmpty(iconUrl) && !Stage.Utils.Url.isUrl(iconUrl)) {
            errors.iconUrl = 'Please provide valid URL for icon file';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const createUploadResource = name => ({
            [name]: { url: this.state[`${name}Url`], file: this.state[`${name}File`] }
        });

        const actions = new Stage.Common.PluginActions(this.props.toolbox);
        actions
            .doUpload(this.state.visibility, {
                ...createUploadResource('wagon'),
                ...createUploadResource('yaml'),
                ...createUploadResource('icon')
            })
            .then(() => {
                this.setState({ errors: {}, loading: false }, this.props.onHide);
                this.props.toolbox.refresh();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    onFormFieldChange(fields) {
        this.setState(fields);
    }

    render() {
        const { ApproveButton, CancelButton, Icon, Modal, VisibilityField } = Stage.Basic;
        const { UploadPluginForm } = Stage.Common;

        return (
            <Modal open={this.props.open} onClose={this.props.onHide}>
                <Modal.Header>
                    <Icon name="upload" /> Upload plugin
                    <VisibilityField
                        visibility={this.state.visibility}
                        className="rightFloated"
                        onVisibilityChange={visibility => this.setState({ visibility })}
                    />
                </Modal.Header>

                <Modal.Content>
                    <UploadPluginForm
                        wagonUrl={this.state.wagonUrl}
                        yamlUrl={this.state.yamlUrl}
                        iconUrl={this.state.iconUrl}
                        errors={this.state.errors}
                        loading={this.state.loading}
                        onChange={this.onFormFieldChange.bind(this)}
                    />
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.props.onHide} disabled={this.state.loading} />
                    <ApproveButton
                        onClick={this.uploadPlugin.bind(this)}
                        disabled={this.state.loading}
                        content="Upload"
                        icon="upload"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

Stage.defineCommon({
    name: 'UploadPluginModal',
    common: UploadPluginModal
});
