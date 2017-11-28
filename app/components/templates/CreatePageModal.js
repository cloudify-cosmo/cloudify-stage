/**
 * Created by pposel on 22/08/2017.
 */
import React, { Component, PropTypes } from 'react';
import Consts from '../../utils/consts';

export default class CreatePageModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = CreatePageModal.initialState(false, props);
    }

    static initialState = (open, props) => {
        return {
            open,
            loading: false,
            pageName: props.pageName,
            errors: {}
        }
    };

    static propTypes = {
        onCreatePage: PropTypes.func.isRequired
    };

    static defaultProps = {
        pageName: ''
    };

    _openModal() {
        this.setState(CreatePageModal.initialState(true, this.props))
    }

    _submitCreate() {
        let errors = {};

        if (_.isEmpty(_.trim(this.state.pageName))) {
            errors['pageName']='Please provide correct page name';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        this.props.onCreatePage(_.trim(this.state.pageName)).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Button, Icon, Form, Segment, ApproveButton, CancelButton, Message, Divider, List} = Stage.Basic;

        const trigger = <Button content='Create page' icon='block layout' labelPosition='left' className='createPageButton'/>;

        return (
            <Modal trigger={trigger} open={this.state.open} onOpen={this._openModal.bind(this)}
                   onClose={()=>this.setState({open:false})} className="createPageModal">
                <Modal.Header>
                    <Icon name="block layout"/>Create page
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors} onErrorsDismiss={() => this.setState({errors: {}})}>
                        <Form.Field error={this.state.errors.pageName}>
                            <Form.Input name='pageName' placeholder="Page name"
                                        value={this.state.pageName} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={()=>this.setState({open:false})} disabled={this.state.loading} />
                    <ApproveButton onClick={this._submitCreate.bind(this)} disabled={this.state.loading} content='Create' icon="checkmark" color="green"/>
                </Modal.Actions>
            </Modal>
        );
    }
};
