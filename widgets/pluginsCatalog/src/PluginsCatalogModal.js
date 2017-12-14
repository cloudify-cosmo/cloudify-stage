/**
 * Created by Tamer on 30/07/2017.
 */

/**
 * @class PluginsCatalogModal
 * @extends {Component}
 */
export default class PluginsCatalogModal extends React.Component {
  /**
   * default initial state
   * 
   * @static
   */
  static initialState = {
    loading: false,
    error: {},
    privateResource: false,
  };

  /**
   * Creates an instance of Modal.
   * @param {any} props 
   * @param {any} context 
   */
  constructor (props, context) {
    super (props, context);
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
   * @param {any} nextProps 
   */
  componentWillReceiveProps (nextProps) {
    if (!this.props.open && nextProps.open) {
      this.setState (PluginsCatalogModal.initialState);
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
  onCancel () {
    this.props.onHide ();
    return true;
  }

  /**
   * onAprove
   * sending to server
   */
  onApprove () {
    this.setState ({loading: true});
    this.props.actions
      .doUpload (this.props.plugin.url, this.state.privateResource)
      .then (() => {
        this.setState ({errors: null, loading: false});
        this.props.toolbox.getEventBus ().trigger ('plugins:refresh');
        this.props.onHide();
        this.props.onSuccess (
          `${this.props.plugin.name} Successfully uploaded`
        );
      })
      .catch (err => {
        this.setState ({error: err.message, loading: false});
      });
    return false;
  }

  /*
  |--------------------------------------------------------------------------
  | React Renderer
  |--------------------------------------------------------------------------
  */
  render () {
    let {
      Modal,
      CancelButton,
      ApproveButton,
      Icon,
      ErrorMessage,
      PrivateField,
    } = Stage.Basic;

    return (
      <div>
        <Modal open={this.props.open} onClose={()=>this.props.onHide()}>
          <Modal.Header>
            <Icon name="upload" /> Upload Plugin
            <PrivateField
              lock={this.state.privateResource}
              className="rightFloated"
              onClick={() =>
                this.setState ({privateResource: !this.state.privateResource})}
            />
          </Modal.Header>

          <Modal.Content>
            <ErrorMessage
              error={this.state.error}
              onDismiss={() => this.setState ({error: null})}
            />
            Are you sure you want to upload the plugin
            {' '}
            <b>({this.props.plugin && this.props.plugin.name})</b>
            {' '}
            .. ?
          </Modal.Content>

          <Modal.Actions>
            <CancelButton
              onClick={this.onCancel.bind (this)}
              disabled={this.state.loading}
            />
            <ApproveButton
              onClick={this.onApprove.bind (this)}
              disabled={this.state.loading}
              loading={this.state.loading}
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
