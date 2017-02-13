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
        let DataTable = Stage.Basic.DataTable;

        let instance = this.props.instance;
        let instanceTotalSize = _.size(instance.runtime_properties);

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
                            <DataTable className="nodeInstanceRelationshipsTable" totalSize={instance.relationships.length}>

                                <DataTable.Column label="Target node" name="target" width="30%"/>
                                <DataTable.Column label="Relationship type" name="relationship" width="40%"/>
                                <DataTable.Column label="Source node" name="source" width="30%"/>

                                {
                                    instance.relationships.map((r) => {
                                        return (
                                            <DataTable.Row key={r.target_name + r.type + instance.node_id}>
                                                <DataTable.Data>{r.target_name}</DataTable.Data>
                                                <DataTable.Data>{r.type}</DataTable.Data>
                                                <DataTable.Data>{instance.node_id}</DataTable.Data>
                                            </DataTable.Row>
                                        );
                                    })
                                }
                            </DataTable>

                            <h3>Runtime properties</h3>
                            <DataTable className="nodeInstanceRuntimePropertiesTable" totalSize={instanceTotalSize}>

                                <DataTable.Column label="Key" name="key" width="50%"/>
                                <DataTable.Column label="Value" name="value" width="50%"/>

                                {
                                    Object.keys(instance.runtime_properties).map(function (key) {
                                        let value = instance.runtime_properties[key];
                                        return (
                                            <DataTable.Row key={key}>
                                                <DataTable.Data>{key}</DataTable.Data>
                                                <DataTable.Data>{value}</DataTable.Data>
                                            </DataTable.Row>
                                        );
                                    })
                                }

                            </DataTable>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Modal.Approve label="Close" icon="" className="green"/>
                    </Modal.Footer>
                </Modal>
            </div>

        );
    }
};
