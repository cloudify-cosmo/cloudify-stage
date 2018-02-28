/**
 * Created by Tamer on 14/08/2017.
 */

import React, { Component, PropTypes } from 'react';
import {Modal} from 'semantic-ui-react';

/**
 * ReadmeModal is a component to present HTML content in Modal component.
 *
 * ## Access
 * `Stage.Basic.ReadmeModal`
 *
 * ## Usage
 * ![ReadmeModal](manual/asset/modals/ReadmeModal_0.png)
 * ```
 * <ReadmeModal open={this.state.showReadmeModal}
 *              content={this.state.readmeContent}
 *              onHide={this._hideReadmeModal.bind(this)} />
 * ```
 */
export default class ReadmeModal extends Component {

  /**
   * propTypes
   * @property {string} content HTML content of modal
   * @property {boolean} open modal open state
   * @property {function} onHide function called when modal is closed
   * @property {string} [className=''] modal classname
   */
  static propTypes = {
      content: PropTypes.string.isRequired,
      open: PropTypes.bool.isRequired,
      onHide: PropTypes.func.isRequired,
      className: PropTypes.string
  };

  static defaultProps = {
      className: ''
  };

  onCancel () {
    this.props.onHide();
    return true;
  }

  getContent () {
    return {__html: this.props.content};
  }

  render () {

    return (
        <Modal open={this.props.open} closeOnEscape={true} closeOnRootNodeClick={true}
               onClose={this.onCancel.bind(this)} closeIcon="close"
               className={`unlimited ${this.props.className}`} size="fullscreen">
          <Modal.Content style={{padding: '50px'}}>
            <div dangerouslySetInnerHTML={this.getContent()} />
          </Modal.Content>
        </Modal>
    );
  }
}
