import i18n from 'i18next';
import { get, isEmpty, noop } from 'lodash';
import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import type { GenericFieldProps } from 'cloudify-ui-components';
import { getToolbox } from '../../../utils/Toolbox';

import { ApproveButton, CancelButton, Form, GenericField, Message, Modal } from '../../basic';
import type { Widget, WidgetConfigurationDefinition } from '../../../utils/StageAPI';
import type { WidgetOwnProps } from '../content/widgets/Widget';

type Fields = Record<string, any>;
type Configuration = Record<string, unknown>;

const getInitialFields: (configDef: WidgetConfigurationDefinition[], configuration: Configuration) => Fields = (
    configDef,
    configuration
) =>
    configDef
        .filter(config => !config.hidden)
        .reduce((fields: Record<string, any>, config) => {
            fields[config.id] = get(configuration, `[${config.id}]`, config.value || config.default);
            return fields;
        }, {});

interface EditWidgetGenericFieldProps extends GenericFieldProps {
    fields: Fields;
    setFields: (fields: Fields) => void;
}
const EditWidgetGenericField: FunctionComponent<EditWidgetGenericFieldProps> = ({
    fields,
    setFields,
    ...restProps
}) => {
    const handleInputChange: GenericFieldProps['onChange'] = (_proxy, field) => {
        const { name } = field;
        const value = GenericField.formatValue(
            restProps.type!,
            restProps.type === GenericField.BOOLEAN_TYPE ? field.checked : field.value
        );

        if (name) setFields({ ...fields, [name]: value });
    };
    return <GenericField onChange={handleInputChange} {...restProps} />;
};

interface EditWidgetModalProps {
    configuration: Configuration;
    configDef: WidgetConfigurationDefinition[];
    widget: Widget;
    show: boolean;
    onWidgetEdited: NonNullable<WidgetOwnProps<any>['onWidgetUpdated']>;
    onHideConfig: () => void;
}

const EditWidgetModal: FunctionComponent<EditWidgetModalProps> = ({
    configDef,
    configuration,
    show,
    onHideConfig,
    onWidgetEdited,
    widget
}) => {
    const [fields, setFields] = useState<Fields>(getInitialFields(configDef, configuration));

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
                                label={config.name || ''}
                                value={fields[config.id]}
                                columns={config.columns}
                                placeholder={config.placeHolder}
                                widgetlessToolbox={getToolbox(noop, noop)}
                            />
                        ))}

                    {isEmpty(configDef) && (
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
                <CancelButton onClick={onDeny} />
                <ApproveButton onClick={onApprove} />
            </Modal.Actions>
        </Modal>
    );
};
export default EditWidgetModal;
