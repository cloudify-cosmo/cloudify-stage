/**
 * Created by pposel on 22/08/2017.
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';

import { Modal, Button, Icon, Form, ApproveButton, CancelButton } from '../basic/index';

export default class CreatePageModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = CreatePageModal.initialState(false, props);
    }

    static initialState = (open, props) => {
        return {
            open,
            loading: false,
            pageName: props.pageName,
            errors: {}
        };
    };

    static propTypes = {
        onCreatePage: PropTypes.func.isRequired
    };

    static defaultProps = {
        pageName: ''
    };

    openModal() {
        this.setState(CreatePageModal.initialState(true, this.props));
    }

    submitCreate() {
        const { pageName } = this.state;
        const errors = {};

        if (_.isEmpty(_.trim(pageName))) {
            errors.pageName = 'Please provide correct page name';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        this.props.onCreatePage(_.trim(pageName)).catch(err => {
            this.setState({ errors: { error: err.message }, loading: false });
        });
    }

    handleInputChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    render() {
        const { errors, loading, open, pageName } = this.state;
        const trigger = (
            <Button content="Create page" icon="block layout" labelPosition="left" className="createPageButton" />
        );

        return (
            <Modal
                trigger={trigger}
                open={open}
                onOpen={this.openModal.bind(this)}
                onClose={() => this.setState({ open: false })}
                className="createPageModal"
            >
                <Modal.Header>
                    <Icon name="block layout" />
                    Create page
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field error={errors.pageName}>
                            <Form.Input
                                name="pageName"
                                placeholder="Page name"
                                value={pageName}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={() => this.setState({ open: false })} disabled={loading} />
                    <ApproveButton
                        onClick={this.submitCreate.bind(this)}
                        disabled={loading}
                        content="Create"
                        icon="checkmark"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
