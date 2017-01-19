/**
 * Created by jakubniezgoda on 10/01/2017.
 */


export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
        }
    }

    render() {
        let Modal = Stage.Basic.Modal;
        let Table = Stage.Basic.Table;

        let instance = this.props.instance;

        return (
            <div>
                <Modal show={this.props.show}
                       className='nodeInstanceModal'
                       onDeny={this.props.onClose}
                       onApprove={this.props.onClose}>
                    <Modal.Header>
                        Node instance {instance.id}
                    </Modal.Header>

                    <Modal.Body>
                        <div>
                            <h3>Relationships</h3>
                            <Table className="nodeInstanceRelationshipsTable">

                                <Table.Column label="Target node" name="target" width="30%"/>
                                <Table.Column label="Relationship type" name="relationship" width="40%"/>
                                <Table.Column label="Source node" name="source" width="30%"/>

                                {
                                    instance.relationships.map((r) => {
                                        return (
                                            <Table.Row key={r.target_name + r.type + instance.node_id}>
                                                <Table.Data>{r.target_name}</Table.Data>
                                                <Table.Data>{r.type}</Table.Data>
                                                <Table.Data>{instance.node_id}</Table.Data>
                                            </Table.Row>
                                        );
                                    })
                                }
                            </Table>

                            <h3>Runtime properties</h3>
                            <Table className="nodeInstanceRuntimePropertiesTable">

                                <Table.Column label="Key" name="key" width="50%"/>
                                <Table.Column label="Value" name="value" width="50%"/>

                                {
                                    Object.keys(instance.runtime_properties).map(function (key) {
                                        let value = instance.runtime_properties[key];
                                        return (
                                            <Table.Row key={key}>
                                                <Table.Data>{key}</Table.Data>
                                                <Table.Data>{value}</Table.Data>
                                            </Table.Row>
                                        );
                                    })
                                }

                            </Table>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <div className="ui ok basic button">
                            Close
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>

        );
    }
};
