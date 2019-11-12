/**
 * Created by addihorowitz on 11/09/2016.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Modal, ApproveButton, CancelButton, GenericField, Form, Message } from './basic';

export default class EditWidgetModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = EditWidgetModal.initialState(props);
    }

    static propTypes = {
        configuration: PropTypes.object.isRequired,
        configDef: PropTypes.array.isRequired,
        widget: PropTypes.object.isRequired,
        show: PropTypes.bool.isRequired,
        onWidgetEdited: PropTypes.func.isRequired,
        onHideConfig: PropTypes.func.isRequired
    };

    static initialState = props => {
        const fields = {};

        props.configDef
            .filter(config => !config.hidden)
            .map(config => {
                const currValue = _.get(props.configuration, `[${config.id}]`, config.value || config.default);
                fields[config.id] = currValue;
            });

        return { fields };
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState(EditWidgetModal.initialState(this.props));
        }
    }

    onApprove() {
        // Get the changed configurations
        const config = _.clone(this.props.configuration);

        _.forEach(this.state.fields, function(value, key) {
            config[key] = value;
        });

        if (config) {
            this.props.onWidgetEdited(config);
        }

        this.props.onHideConfig();
        return true;
    }

    onDeny() {
        this.props.onHideConfig();
        return true;
    }

    _handleInputChange(proxy, field) {
        const { name } = field;
        const value = GenericField.formatValue(
            field.genericType,
            field.genericType === GenericField.BOOLEAN_TYPE ? field.checked : field.value
        );

        this.setState({ fields: { ...this.state.fields, [name]: value } });
    }

    render() {
        return (
            <Modal open={this.props.show} onClose={() => this.props.onHideConfig()} className="editWidgetModal">
                <Modal.Header>Configure Widget</Modal.Header>

                <Modal.Content>
                    <Form>
                        {this.props.configDef
                            .filter(config => !config.hidden)
                            .map(config => {
                                return (
                                    <GenericField
                                        {...config}
                                        key={config.id}
                                        name={config.id}
                                        label={config.name}
                                        value={this.state.fields[config.id]}
                                        onChange={this._handleInputChange.bind(this)}
                                    />
                                );
                            })}

                        {_.isEmpty(this.props.configDef) && (
                            <Message>No configuration available for this widget</Message>
                        )}
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <ApproveButton onClick={this.onApprove.bind(this)} />
                    <CancelButton onClick={this.onDeny.bind(this)} />
                </Modal.Actions>
            </Modal>
        );
    }
}
