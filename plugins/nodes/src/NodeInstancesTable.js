/**
 * Created by jakubniezgoda on 10/01/2017.
 */

import InstanceModal from './NodeInstanceModal';

const EMPTY_NODE_INSTANCE_OBJ = {id: '', relationships: [], runtime_properties: {}};

export default class extends React.Component {
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
        let Grid = Stage.Basic.Grid;

        return (
            <div>

                <Grid.Table fetchData={() => {}}
                            totalSize={this.props.instances.length}
                            pageSize={this.props.widget.plugin.pageSize}
                            selectable={false}
                            className="nodesInstancesTable">

                    <Grid.Column label="Instance" name="id" width="40%"/>
                    <Grid.Column label="Status" name="state" width="30%"/>
                    <Grid.Column label="Details" name="details" width="30%"/>

                    {
                        this.props.instances.map((instance) => {
                            return (
                                <Grid.Row key={instance.id}>
                                    <Grid.Data>{instance.id}</Grid.Data>
                                    <Grid.Data>{instance.state}</Grid.Data>
                                    <Grid.Data className="center aligned rowActions">
                                        <i className="table icon link bordered"
                                           onClick={this._showInstanceModal.bind(this, instance)}>
                                        </i>
                                    </Grid.Data>
                                </Grid.Row>
                            );
                        })
                    }
                </Grid.Table>

                <InstanceModal show={this.state.showModal}
                               onClose={this._closeInstanceModal.bind(this)}
                               widget={this.props.widget}
                               instance={this.state.instance}/>
            </div>
        );
    }
};
