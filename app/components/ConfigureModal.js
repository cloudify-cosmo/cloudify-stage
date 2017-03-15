/**
 * Created by kinneretzin on 07/03/2017.
 */

import React, {Component, PropTypes} from "react";
import {Modal, ErrorMessage, GenericField, Form} from "./basic";

export default class ConfigureModal extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            loading: false,
            canUserEdit: false
        }
    }

    static initialState = {
    }

    static propTypes = {
        show: PropTypes.bool.isRequired,
        onSave: PropTypes.func.isRequired
    };

    static defaultProps = {
    };

    onApprove () {
        var canUserEditInputValue = $($(this.refs.configForm).find('.fieldInput')[0]).is(':checked');

        this.props.onSave({canUserEdit: canUserEditInputValue})
            .then(this.props.onHide)
            .catch((err)=>{
                    this.setState({error: err});
                });
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    render() {

        return (
            <Modal show={this.props.show}
                   onDeny={this.onDeny.bind(this)}
                   onApprove={this.onApprove.bind(this)}
                   onVisible={(modal)=>$(modal).find('[data-content]').popup()}
                   loading={this.state.loading}>
                <Modal.Header>
                    Configure UI properties
                </Modal.Header>
                <Modal.Body>
                    <ErrorMessage error={this.state.error}/>

                    <div className="ui form" ref='configForm'>
                        <GenericField ref='canUserEditInput'
                                      label='Can regular user edit his own screens?'
                                      id='canUserEdit'
                                      type={GenericField.BOOLEAN_TYPE}
                                      description='Check this if you want to allow users (non admin) to edit their own screens in the UI (move to edit mode)'
                                      value={this.props.config.canUserEdit}/>
                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <Modal.Cancel label="Cancel"/>
                    <Modal.Approve label="Save" className="green"/>
                </Modal.Footer>
            </Modal>
        )
    }
}