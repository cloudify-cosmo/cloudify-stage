/**
 * Created by Tamer on 14/08/2017.
 */

export default class ReadmeModal extends React.Component {
  onCancel () {
    this.props.onHide ();
    return true;
  }

  createMarkup () {
    return {__html: this.props.content};
  }

  render () {
    var {Modal} = Stage.Basic;

    return (
      <div>
        <Modal
          open={this.props.open}
          closeOnEscape={true}
          closeOnRootNodeClick={true}
          onClose={this.onCancel.bind (this)}
          closeIcon="close"
          size="fullscreen">
          <Modal.Content style={{padding: '50px'}}>
            <div dangerouslySetInnerHTML={this.createMarkup ()} />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
