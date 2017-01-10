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
        let Header = Stage.Basic.ModalHeader;
        let Body = Stage.Basic.ModalBody;
        let Footer = Stage.Basic.ModalFooter;
        let Grid = Stage.Basic.Grid;

        let instance = this.props.instance;

        return (
            <div>
                <Modal show={this.props.show}
                       className='nodeInstanceModal'
                       onDeny={this.props.onClose}
                       onApprove={this.props.onClose}>
                    <Header>
                        Node instance {instance.id}
                    </Header>

                    <Body>
                        <div>
                            <h3>Relationships</h3>
                            <Grid.Table fetchData={() => {}}
                                        totalSize={instance.relationships.length}
                                        pageSize={this.props.widget.plugin.pageSize}
                                        className="nodeInstanceRelationshipsTable">

                                <Grid.Column label="Target node" name="target" width="30%"/>
                                <Grid.Column label="Relationship type" name="relationship" width="40%"/>
                                <Grid.Column label="Source node" name="source" width="30%"/>

                                {
                                    instance.relationships.map((r) => {
                                        return (
                                            <Grid.Row key={r.target_name + r.type + instance.node_id}>
                                                <Grid.Data>{r.target_name}</Grid.Data>
                                                <Grid.Data>{r.type}</Grid.Data>
                                                <Grid.Data>{instance.node_id}</Grid.Data>
                                            </Grid.Row>
                                        );
                                    })
                                }
                            </Grid.Table>

                            <h3>Runtime properties</h3>
                            <Grid.Table fetchData={() => {}}
                                        totalSize={Object.keys(instance.runtime_properties).length}
                                        pageSize={this.props.widget.plugin.pageSize}
                                        className="nodeInstanceRuntimePropertiesTable">

                                <Grid.Column label="Key" name="key" width="50%"/>
                                <Grid.Column label="Value" name="value" width="50%"/>

                                {
                                    Object.keys(instance.runtime_properties).map(function (key) {
                                        let value = instance.runtime_properties[key];
                                        return (
                                            <Grid.Row key={key}>
                                                <Grid.Data>{key}</Grid.Data>
                                                <Grid.Data>{value}</Grid.Data>
                                            </Grid.Row>
                                        );
                                    })
                                }

                            </Grid.Table>
                        </div>
                    </Body>

                    <Footer>
                        <div className="ui ok basic button">
                            Close
                        </div>
                    </Footer>
                </Modal>
            </div>

        );
    }
};
