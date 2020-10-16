/**
 * Created by jakubniezgoda on 15/04/2019.
 */

const PropertiesPropType = PropTypes.objectOf(
    PropTypes.shape({
        description: PropTypes.string,
        type: PropTypes.string,
        default: Stage.PropTypes.AnyData,
        required: PropTypes.bool
    })
);

const { Header } = Stage.Basic;

const DataTypeProperty = ({ show, name, value }) =>
    show && (
        <>
            <Header as="h4">{_.capitalize(name)}</Header>
            {value}
        </>
    );

DataTypeProperty.propTypes = {
    name: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    value: PropTypes.node
};

DataTypeProperty.defaultProps = {
    value: null
};

function DataType({ name, description, version, derivedFrom, properties }) {
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
}

DataType.propTypes = {
    derivedFrom: PropTypes.string,
    description: PropTypes.string,
    properties: PropertiesPropType.isRequired,
    name: PropTypes.string.isRequired,
    version: PropTypes.string
};

DataType.defaultProps = {
    derivedFrom: null,
    description: null,
    version: null
};

class DataTypesButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
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
        const { Button, CancelButton, Modal } = Stage.Basic;

        return (
            <div>
                <Button
                    icon="code"
                    content="Show Data Types"
                    onClick={this.onOpen}
                    className="rightFloated"
                    labelPosition="left"
                />

                <Modal open={open} onClose={this.onClose}>
                    <Modal.Header>Data Types</Modal.Header>

                    <Modal.Content>
                        {_.map(types, (typeObject, typeName) => (
                            <DataType
                                key={typeName}
                                name={typeName}
                                description={typeObject.description}
                                derivedFrom={typeObject.derived_from}
                                version={typeObject.version}
                                properties={typeObject.properties}
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

DataTypesButton.propTypes = {
    types: PropTypes.objectOf(
        PropTypes.shape({
            derived_from: PropTypes.string,
            version: PropTypes.string,
            properties: PropertiesPropType.isRequired
        }).isRequired
    ).isRequired
};

Stage.defineCommon({
    name: 'DataTypesButton',
    common: DataTypesButton
});
