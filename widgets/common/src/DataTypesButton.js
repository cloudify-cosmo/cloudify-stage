/**
 * Created by jakubniezgoda on 15/04/2019.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

function DataType({name, description, version, derivedFrom, properties}) {
    let {Header, ParameterValue, Segment, Table} = Stage.Basic;
    let {InputsUtils} = Stage.Common;
    const DataTypeProperty = ({show, name, value}) =>
        show &&
        <React.Fragment>
            <Header as='h4'>
                {_.capitalize(name)}
            </Header>
            {value}
        </React.Fragment>;

    const example = InputsUtils.getTemplateForDataType({properties});

    return (
        <div>
            <Header as='h3' attached='top'>{name}</Header>
            <Segment attached>
                <DataTypeProperty name='Description' show={!!description} value={description} />

                <DataTypeProperty name='Version' show={!!version} value={version}/>

                <DataTypeProperty name='Derived From' show={!!derivedFrom} value={derivedFrom} />

                <DataTypeProperty name='Properties' show={!!properties} value={
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
                            {
                                _.map(properties, (propertyObject, propertyName) =>
                                    <Table.Row key={propertyName} name={propertyName}>
                                        <Table.Cell>
                                            {propertyName}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {propertyObject.type}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {propertyObject.description}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <ParameterValue value={propertyObject.default} showCopyButton={false} />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {!!propertyObject.required ? 'Yes' : 'No'}
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                        </Table.Body>
                    </Table>
                } />

                <DataTypeProperty name='Example' show={!!properties}
                                  value={<ParameterValue value={example} />} />
            </Segment>
        </div>
    );
}

class DataTypesButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    static propTypes = {
        types: PropTypes.objectOf(
                PropTypes.shape({
                    derived_from: PropTypes.string,
                    version: PropTypes.string,
                    properties: PropTypes.objectOf(
                        PropTypes.shape({
                            description: PropTypes.string,
                            type: PropTypes.string,
                            default: PropTypes.any,
                            required: PropTypes.bool
                        })
                    ).isRequired
                }).isRequired
            ).isRequired
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) ||
               !_.isEqual(this.state, nextState);
    }

    onOpen() {
        this.setState({open: true});
    }

    onClose() {
        this.setState({open: false});
    }

    render() {
        let {Button, CancelButton, Modal} = Stage.Basic;

        return (
            <div>
                <Button icon='code' content='Show Data Types' onClick={this.onOpen}
                        className='rightFloated' labelPosition='left' />

                <Modal open={this.state.open} onClose={this.onClose}>
                    <Modal.Header>
                        Data Types
                    </Modal.Header>

                    <Modal.Content>
                        {
                            _.map(this.props.types, (typeObject, typeName) =>
                                <DataType key={typeName} name={typeName} description={typeObject.description}
                                          derivedFrom={typeObject.derived_from} version={typeObject.version}
                                          properties={typeObject.properties} />
                            )
                        }
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.onClose} content='Close' />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

Stage.defineCommon({
    name: 'DataTypesButton',
    common: DataTypesButton
});