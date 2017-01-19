/**
 * Created by jakubniezgoda on 03/01/2017.
 */

import NodeInstancesTable from './NodeInstancesTable';

export default class NodesTable extends React.Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
        };
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    _selectNode (item){
        let selectedNodeId = this.props.toolbox.getContext().getValue('nodeId');
        let clickedNodeId = item.id + item.deployment_id;
        this.props.toolbox.getContext().setValue('nodeId', clickedNodeId === selectedNodeId ? null : clickedNodeId);
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('nodes:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('nodes:refresh', this._refreshData);
    }

    fetchGridData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    render() {
        let ErrorMessage = Stage.Basic.ErrorMessage;
        let Table = Stage.Basic.Table;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <Table fetchData={this.fetchGridData.bind(this)}
                            totalSize={this.props.data.total}
                            pageSize={this.props.widget.pageSize}
                            selectable={true}
                            className="nodesTable">

                    <Table.Column label="Name" name="id" width="30%"/>
                    <Table.Column label="Type" name="type" width="20%"/>
                    <Table.Column label="Blueprint" name="blueprintId" width="10%" show={!this.props.data.blueprintId} />
                    <Table.Column label="Deployment" name="deploymentId" width="10%" show={!this.props.data.deploymentId} />
                    <Table.Column label="Contained in" name="containedIn" width="10%"/>
                    <Table.Column label="Connected to" name="connectedTo" width="10%"/>
                    <Table.Column label="# Instances" name="numberOfInstances" width="10%"/>
                    {
                        this.props.data.items.map((node) => {
                            return (
                                <Table.RowExpandable key={node.id + node.deployment_id} expanded={node.isSelected}>

                                    <Table.Row key={node.id + node.deployment_id} selected={node.isSelected} onClick={this._selectNode.bind(this, node)}>
                                        <Table.Data><a className='nodeName' href="javascript:void(0)">{node.id}</a></Table.Data>
                                        <Table.Data>{node.type}</Table.Data>
                                        <Table.Data>{node.blueprint_id}</Table.Data>
                                        <Table.Data>{node.deployment_id}</Table.Data>
                                        <Table.Data>{node.containedIn}</Table.Data>
                                        <Table.Data>{node.connectedTo}</Table.Data>
                                        <Table.Data><div className="ui green horizontal label">{node.numberOfInstances}</div></Table.Data>
                                    </Table.Row>

                                    <Table.DataExpandable>
                                        <NodeInstancesTable instances={node.instances} widget={this.props.widget} toolbox={this.props.toolbox}>
                                        </NodeInstancesTable>
                                    </Table.DataExpandable>

                                </Table.RowExpandable>
                            );
                        })
                    }

                </Table>

            </div>

        );
    }
};
