// @ts-nocheck File not migrated fully to TS
import { FunctionComponent, ReactElement } from 'react';
import { useBoolean } from '../../../app/utils/hooks';

interface Properties {
    description?: string;
    type?: string;
    default?: any;
    required?: boolean;
}

const { Header } = Stage.Basic;

interface DataTypePropertyProps {
    show: boolean;
    name: string;
    value?: ReactElement | string | null;
}

const DataTypeProperty: FunctionComponent<DataTypePropertyProps> = ({ show, name, value = null }) =>
    show ? (
        <>
            <Header as="h4">{_.capitalize(name)}</Header>
            {value}
        </>
    ) : null;

interface DataTypeProps {
    name: string;
    description: string;
    version?: string;
    derivedFrom: string;
    properties: Properties;
}

const t = Stage.Utils.getT('widgets.common.deployments.deployModal');

const DataType: FunctionComponent<DataTypeProps> = ({
    name,
    description = null,
    version = null,
    derivedFrom = null,
    properties
}) => {
    const { Segment, Table } = Stage.Basic;
    const { InputsUtils, ParameterValue } = Stage.Common;

    const example = InputsUtils.getTemplateForDataType({ properties });

    return (
        <div>
            <Header as="h3" attached="top">
                {name}
            </Header>
            <Segment attached>
                <DataTypeProperty name="Description" show={!!description} value={description} />

                <DataTypeProperty name="Version" show={!!version} value={version} />

                <DataTypeProperty name="Derived From" show={!!derivedFrom} value={derivedFrom} />

                <DataTypeProperty
                    name="Properties"
                    show={!!properties}
                    value={
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Type</Table.HeaderCell>
                                    <Table.HeaderCell>Description</Table.HeaderCell>
                                    <Table.HeaderCell>Default Value</Table.HeaderCell>
                                    <Table.HeaderCell>Required</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {_.map(properties, (propertyObject, propertyName) => (
                                    <Table.Row key={propertyName} name={propertyName}>
                                        <Table.Cell>{propertyName}</Table.Cell>
                                        <Table.Cell>{propertyObject.type}</Table.Cell>
                                        <Table.Cell>{propertyObject.description}</Table.Cell>
                                        <Table.Cell>
                                            <ParameterValue value={propertyObject.default} showCopyButton={false} />
                                        </Table.Cell>
                                        <Table.Cell>{propertyObject.required ? 'Yes' : 'No'}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    }
                />

                <DataTypeProperty name="Example" show={!!properties} value={<ParameterValue value={example} />} />
            </Segment>
        </div>
    );
};

interface DataTypesButtonProps {
    iconButton: boolean;
    types: {
        derivedFrom?: string;
        version?: string;
        properties: Properties;
        description?: string;
    };
}

const DataTypesButton: FunctionComponent<DataTypesButtonProps> = ({ types, iconButton = false }) => {
    const { Button, CancelButton, Modal, Popup } = Stage.Basic;
    const [open, onOpen, onClose] = useBoolean(false);
    return (
        <div>
            {iconButton ? (
                <Popup
                    content={t('buttons.showDataTypes')}
                    trigger={
                        <Button icon="code" onClick={onOpen} floated="right" aria-label={t('buttons.showDataTypes')} />
                    }
                />
            ) : (
                <Button
                    icon="code"
                    content={t('buttons.showDataTypes')}
                    onClick={onOpen}
                    floated="right"
                    labelPosition="left"
                />
            )}

            <Modal open={open} onClose={onClose}>
                <Modal.Header>Data Types</Modal.Header>

                <Modal.Content>
                    {_.map(types, (typeObject, typeName) => (
                        <DataType
                            key={typeName}
                            name={typeName}
                            description={typeObject.description}
                            derivedFrom={typeObject.derivedFrom}
                            version={typeObject.version}
                            properties={typeObject.properties}
                        />
                    ))}
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={onClose} content="Close" />
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default DataTypesButton;

declare global {
    namespace Stage.Common {
        export { DataTypesButton };
    }
}

Stage.defineCommon({
    name: 'DataTypesButton',
    common: DataTypesButton
});
