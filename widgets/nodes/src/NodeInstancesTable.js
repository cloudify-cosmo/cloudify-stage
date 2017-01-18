/**
 * Created by jakubniezgoda on 10/01/2017.
 */

import InstanceModal from './NodeInstanceModal';

const EMPTY_NODE_INSTANCE_OBJ = {id: '', relationships: [], runtime_properties: {}};

export default class NodeInstancesTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false,
            instance: EMPTY_NODE_INSTANCE_OBJ
        };
    }

    _showInstanceModal(instance) {
        this.setState(
            {
                showModal: true,
                instance: instance
            }
        );
    }

    _closeInstanceModal() {
        this.setState(
            {
                showModal: false,
                instance: EMPTY_NODE_INSTANCE_OBJ
            }
        );
        return true;
    }

    render() {
        let Table = Stage.Basic.Table;

        return (
            <div>

                <Table className="nodesInstancesTable">

                    <Table.Column label="Instance" name="id" width="40%"/>
                    <Table.Column label="Status" name="state" width="30%"/>
                    <Table.Column label="Details" name="details" width="30%"/>

                    {
                        this.props.instances.map((instance) => {
                            return (
                                <Table.Row key={instance.id}>
                                    <Table.Data>{instance.id}</Table.Data>
                                    <Table.Data>{instance.state}</Table.Data>
                                    <Table.Data className="center aligned rowActions">
                                        <i className="table icon link bordered"
                                           onClick={this._showInstanceModal.bind(this, instance)}>
                                        </i>
                                    </Table.Data>
                                </Table.Row>
                            );
                        })
                    }
                </Table>

                <InstanceModal show={this.state.showModal}
                               onClose={this._closeInstanceModal.bind(this)}
                               widget={this.props.widget}
                               instance={this.state.instance}/>
            </div>
        );
    }
};
