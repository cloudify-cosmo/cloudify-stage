// @ts-nocheck File not migrated fully to TS
import i18n from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { getToolbox } from '../utils/Toolbox';

import { ApproveButton, CancelButton, Form, GenericField, Message, Modal } from './basic';

const getInitialFields = (configDef, configuration) =>
    configDef
        .filter(config => !config.hidden)
        .reduce((fields, config) => {
            fields[config.id] = _.get(configuration, `[${config.id}]`, config.value || config.default);
            return fields;
        }, {});

function EditWidgetGenericField({ fields, setFields, ...restProps }) {
    const handleInputChange = (proxy, field) => {
        const { name } = field;
        const value = GenericField.formatValue(
            restProps.type,
            restProps.type === GenericField.BOOLEAN_TYPE ? field.checked : field.value
        );

        setFields({ ...fields, [name]: value });
    };
    return <GenericField onChange={handleInputChange} {...restProps} />;
}

export default function EditWidgetModal({ configDef, configuration, show, onHideConfig, onWidgetEdited, widget }) {
    const [fields, setFields] = useState(getInitialFields(configDef, configuration));

    useEffect(() => {
        if (show) setFields(getInitialFields(configDef, configuration));
    }, [show]);

    const onApprove = useCallback(() => {
        if (configuration) {
            onWidgetEdited(widget.id, { configuration: { ...configuration, ...fields } });
        }

        onHideConfig();
        return true;
    }, [fields]);

    const onDeny = useCallback(() => {
        onHideConfig();
        return true;
    }, []);

    return (
        <Modal open={show} onClose={onHideConfig} className="editWidgetModal">
            <Modal.Header>Configure Widget</Modal.Header>

            <Modal.Content>
                <Form>
                    {configDef
                        .filter(config => !config.hidden)
                        .map(config => (
                            <EditWidgetGenericField
                                fields={fields}
                                setFields={setFields}
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
                                columns={config.columns}
                                widgetlessToolbox={getToolbox(undefined, undefined, undefined)}
                            />
                        ))}

                    {_.isEmpty(configDef) && (
                        <Message>
                            {i18n.t(
                                'editMode.editWidget.noConfiguration',
                                'No configuration available for this widget'
                            )}
                        </Message>
                    )}
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
            // eslint-disable-next-line react/forbid-prop-types
            default: PropTypes.any,
            id: PropTypes.string,
            name: PropTypes.string,
            hidden: PropTypes.bool,
            // eslint-disable-next-line react/forbid-prop-types
            columns: PropTypes.array,
            // eslint-disable-next-line react/forbid-prop-types
            value: PropTypes.any
        })
    ).isRequired,
    widget: PropTypes.shape({ id: PropTypes.string }).isRequired,
    show: PropTypes.bool.isRequired,
    onWidgetEdited: PropTypes.func.isRequired,
    onHideConfig: PropTypes.func.isRequired
};
