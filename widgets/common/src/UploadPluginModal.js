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
        toolbox: Stage.Common.PropTypes.Toolbox.isRequired
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
        const { open } = this.props;
        if (!prevProps.open && open) {
            this.setState(UploadPluginModal.initialState);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { open } = this.props;
        return !_.isEqual(open, nextProps.open) || !_.isEqual(this.state, nextState);
    }

    uploadPlugin() {
        const { onHide, toolbox } = this.props;
        const { wagonUrl, yamlUrl, iconUrl, iconFile, title, visibility, wagonFile, yamlFile } = this.state;

        const errors = {};

        if (!wagonFile) {
            if (_.isEmpty(wagonUrl)) {
                errors.wagonUrl = 'Please select wagon file or provide URL to wagon file';
            } else if (!Stage.Utils.Url.isUrl(wagonUrl)) {
                errors.wagonUrl = 'Please provide valid URL for wagon file';
            }
        }

        if (!yamlFile) {
            if (_.isEmpty(yamlUrl)) {
                errors.yamlUrl = 'Please select YAML file or provide URL to YAML file';
            } else if (!Stage.Utils.Url.isUrl(yamlUrl)) {
                errors.yamlUrl = 'Please provide valid URL for YAML file';
            }
        }

        if (!title) {
            errors.title = 'Please provide plugin title';
        }

        if (!iconFile && !_.isEmpty(iconUrl) && !Stage.Utils.Url.isUrl(iconUrl)) {
            errors.iconUrl = 'Please provide valid URL for icon file';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const createUploadResource = name => {
            const { [`${name}Url`]: url, [`${name}File`]: file } = this.state;
            return {
                [name]: { url, file }
            };
        };

        const actions = new Stage.Common.PluginActions(toolbox);
        actions
            .doUpload(visibility, title, {
                ...createUploadResource('wagon'),
                ...createUploadResource('yaml'),
                ...createUploadResource('icon')
            })
            .then(() => {
                this.setState({ errors: {}, loading: false }, onHide);
                toolbox.refresh();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    onFormFieldChange(fields) {
        this.setState(fields);
    }

    render() {
        const { errors, iconUrl, loading, visibility, wagonUrl, yamlUrl } = this.state;
        const { onHide, open, toolbox } = this.props;
        const { ApproveButton, CancelButton, Form, Icon, Modal, VisibilityField } = Stage.Basic;
        const { UploadPluginForm } = Stage.Common;

        return (
            <Modal open={open} onClose={onHide}>
                <Modal.Header>
                    <Icon name="upload" /> Upload plugin
                    <VisibilityField
                        visibility={visibility}
                        className="rightFloated"
                        onVisibilityChange={visibility => this.setState({ visibility })}
                    />
                </Modal.Header>

                <Modal.Content>
                    <Form errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })} loading={loading}>
                        <UploadPluginForm
                            wagonUrl={wagonUrl}
                            yamlUrl={yamlUrl}
                            iconUrl={iconUrl}
                            errors={errors}
                            onChange={this.onFormFieldChange.bind(this)}
                            toolbox={toolbox}
                        />
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={onHide} disabled={loading} />
                    <ApproveButton
                        onClick={this.uploadPlugin.bind(this)}
                        disabled={loading}
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
