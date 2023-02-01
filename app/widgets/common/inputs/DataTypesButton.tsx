import React from 'react';
import type { ReactNode } from 'react';
import { capitalize, map, isEqual } from 'lodash';
import getTemplateForDataType from './utils/getTemplateForDataType';
import ParameterValue from '../components/parameter/ParameterValue';
import { CancelButton, Header, Icon, Modal, Popup, Segment, Table } from '../../../components/basic';
import translateInputs from './utils/translateInputs';
import type { BlueprintPlan } from '../blueprints/BlueprintActions';

type Properties = BlueprintPlan['data_types']['properties'];

type DataTypes = BlueprintPlan['data_types'] & {
    properties: Properties;
};

interface DataTypePropertyProps {
    name: string;
    show: boolean;
    value?: ReactNode;
}

const DataTypeProperty = ({ show, name, value }: DataTypePropertyProps) => {
    return (
        <>
            {show && (
                <>
                    <Header as="h4">{capitalize(name)}</Header>
                    {value}
                </>
            )}
        </>
    );
};

interface DataTypeProps {
    derivedFrom?: string;
    description?: string;
    properties: Properties;
    name: string;
    version?: string;
}

function DataType({ name, description, version, derivedFrom, properties }: DataTypeProps) {
    const example = getTemplateForDataType({ properties });

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
                                {map(properties, (propertyObject, propertyName) => (
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
}

interface DataTypesButtonProps {
    iconButton?: boolean;
    types: DataTypes;
}

interface DataTypesButtonState {
    open: boolean;
}

class DataTypesButton extends React.Component<DataTypesButtonProps, DataTypesButtonState> {
    constructor(props: DataTypesButtonProps) {
        super(props);

        this.state = {
            open: false
        };

        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    shouldComponentUpdate(nextProps: DataTypesButtonProps, nextState: DataTypesButtonState) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
    }

    onOpen() {
        this.setState({ open: true });
    }

    onClose() {
        this.setState({ open: false });
    }

    render() {
        const { types } = this.props;
        const { open } = this.state;
        const buttonTitle = translateInputs('buttons.dataTypes.title');

        return (
            <div>
                <Popup
                    content={buttonTitle}
                    trigger={
                        <Icon
                            name="code"
                            onClick={this.onOpen}
                            color="blue"
                            size="large"
                            link
                            aria-label={buttonTitle}
                        />
                    }
                />

                <Modal open={open} onClose={this.onClose}>
                    <Modal.Header>Data Types</Modal.Header>

                    <Modal.Content>
                        {map(types, (typeValue: Record<string, any>, typeName: string) => (
                            <DataType
                                key={typeName}
                                name={typeName}
                                description={typeValue.description}
                                derivedFrom={typeValue.derived_from}
                                version={typeValue.version}
                                properties={typeValue.properties}
                            />
                        ))}
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.onClose} content="Close" />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

export default DataTypesButton;
