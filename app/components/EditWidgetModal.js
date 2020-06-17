/**
 * Created by addihorowitz on 11/09/2016.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { ApproveButton, CancelButton, Form, GenericField, Message, Modal } from './basic';

export default class EditWidgetModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = EditWidgetModal.initialState(props);
    }

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
        const { open } = this.props;
        if (!prevProps.open && open) {
            this.setState(EditWidgetModal.initialState(this.props));
        }
    }

    onApprove() {
        const { configuration, onHideConfig, onWidgetEdited, widget } = this.props;

        if (configuration) {
            const { fields } = this.state;
            onWidgetEdited(widget.id, { configuration: { ...configuration, ...fields } });
        }

        onHideConfig();
        return true;
    }

    onDeny() {
        const { onHideConfig } = this.props;
        onHideConfig();
        return true;
    }

    handleInputChange(proxy, field) {
        const { fields } = this.state;
        const { name } = field;
        const value = GenericField.formatValue(
            field.genericType,
            field.genericType === GenericField.BOOLEAN_TYPE ? field.checked : field.value
        );

        this.setState({ fields: { ...fields, [name]: value } });
    }

    render() {
        const { configDef, onHideConfig, show } = this.props;
        const { fields } = this.state;

        return (
            <Modal open={show} onClose={() => onHideConfig()} className="editWidgetModal">
                <Modal.Header>Configure Widget</Modal.Header>

                <Modal.Content>
                    <Form>
                        {configDef
                            .filter(config => !config.hidden)
                            .map(config => (
                                <GenericField
                                    {...config}
                                    key={config.id}
                                    name={config.id}
                                    label={config.name}
                                    value={fields[config.id]}
                                    onChange={this.handleInputChange.bind(this)}
                                />
                            ))}

                        {_.isEmpty(configDef) && <Message>No configuration available for this widget</Message>}
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

EditWidgetModal.propTypes = {
    configuration: PropTypes.shape({}).isRequired,
    configDef: PropTypes.arrayOf(
        PropTypes.shape({
            default: PropTypes.any,
            id: PropTypes.string,
            name: PropTypes.string,
            hidden: PropTypes.bool,
            value: PropTypes.any
        })
    ).isRequired,
    widget: PropTypes.shape({ id: PropTypes.string }).isRequired,
    show: PropTypes.bool.isRequired,
    onWidgetEdited: PropTypes.func.isRequired,
    onHideConfig: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
