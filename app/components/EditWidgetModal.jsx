/**
 * Created by addihorowitz on 11/09/2016.
 */

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { ApproveButton, CancelButton, Form, GenericField, Message, Modal } from './basic';

export default function EditWidgetModal({ configDef, configuration, show, onHideConfig, onWidgetEdited, widget }) {
    function getInitialFields() {
        const fields = {};

        configDef
            .filter(config => !config.hidden)
            .forEach(config => {
                const currValue = _.get(configuration, `[${config.id}]`, config.value || config.default);
                fields[config.id] = currValue;
            });

        return fields;
    }

    const [fields, setFields] = useState(getInitialFields());

    useEffect(() => {
        if (show) setFields(getInitialFields());
    }, [show]);

    function onApprove() {
        if (configuration) {
            onWidgetEdited(widget.id, { configuration: { ...configuration, ...fields } });
        }

        onHideConfig();
        return true;
    }

    function onDeny() {
        onHideConfig();
        return true;
    }

    function handleInputChange(proxy, field) {
        const { name } = field;
        const value = GenericField.formatValue(
            field.genericType,
            field.genericType === GenericField.BOOLEAN_TYPE ? field.checked : field.value
        );

        setFields({ ...fields, [name]: value });
    }

    return (
        <Modal open={show} onClose={() => onHideConfig()} className="editWidgetModal">
            <Modal.Header>Configure Widget</Modal.Header>

            <Modal.Content>
                <Form>
                    {configDef
                        .filter(config => !config.hidden)
                        .map(config => (
                            <GenericField
                                component={config.component}
                                default={config.default}
                                description={config.description}
                                items={config.items}
                                min={config.min}
                                max={config.max}
                                type={config.type}
                                key={config.id}
                                name={config.id}
                                label={config.name}
                                value={fields[config.id]}
                                onChange={handleInputChange}
                            />
                        ))}

                    {_.isEmpty(configDef) && <Message>No configuration available for this widget</Message>}
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <ApproveButton onClick={onApprove} />
                <CancelButton onClick={onDeny} />
            </Modal.Actions>
        </Modal>
    );
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
    onHideConfig: PropTypes.func.isRequired
};
