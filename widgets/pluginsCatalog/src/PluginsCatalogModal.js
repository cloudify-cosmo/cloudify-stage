/**
 * Created by Tamer on 30/07/2017.
 */

/**
 * @class PluginsCatalogModal
 * @augments {Component}
 */
export default class PluginsCatalogModal extends React.Component {
    /**
     * default initial state
     *
     * @static
     */
    static initialState = {
        loading: false,
        error: null,
        visibility: Stage.Common.Consts.defaultVisibility
    };

    /**
     * Creates an instance of Modal.
     *
     * @param {any} props
     * @param {any} context
     */
    constructor(props, context) {
        super(props, context);
        this.state = PluginsCatalogModal.initialState;
    }

    /*
  |--------------------------------------------------------------------------
  | React Events
  |--------------------------------------------------------------------------
  */

    /**
     * update state with initialState if not sended yet
     *
     * @param {any} prevProps
     */
    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState(PluginsCatalogModal.initialState);
        }
    }

    /*
  |--------------------------------------------------------------------------
  | Modal Events
  |--------------------------------------------------------------------------
  */

    /**
     * onCancel
     * just hide the modal
     */
    onCancel() {
        this.props.onHide();
        return true;
    }

    /**
     * onAprove
     * sending to server
     */
    onApprove() {
        const { actions, onHide, onSuccess, plugin, toolbox } = this.props;
        this.setState({ loading: true });
        actions
            .doUpload(plugin, this.state.visibility)
            .then(() => {
                this.setState({ errors: null, loading: false });
                toolbox.getEventBus().trigger('plugins:refresh');
                onHide();
                onSuccess(`${plugin.title} Successfully uploaded`);
            })
            .catch(err => {
                this.setState({ error: err.message, loading: false });
            });
        return false;
    }

    /*
  |--------------------------------------------------------------------------
  | React Renderer
  |--------------------------------------------------------------------------
  */
    render() {
        const { error, loading, visibility } = this.state;
        const { onHide, open, plugin } = this.props;
        const { Modal, CancelButton, ApproveButton, Icon, ErrorMessage, VisibilityField } = Stage.Basic;

        return (
            <div>
                <Modal open={open} onClose={() => onHide()}>
                    <Modal.Header>
                        <Icon name="upload" /> Upload Plugin
                        <VisibilityField
                            visibility={visibility}
                            className="rightFloated"
                            onVisibilityChange={visibility => this.setState({ visibility })}
                        />
                    </Modal.Header>

                    <Modal.Content>
                        <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} />
                        Are you sure you want to upload the plugin <b>{plugin && plugin.title}</b>?
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                        <ApproveButton
                            onClick={this.onApprove.bind(this)}
                            disabled={loading}
                            loading={loading}
                            content="Upload"
                            icon="upload"
                            color="green"
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}
