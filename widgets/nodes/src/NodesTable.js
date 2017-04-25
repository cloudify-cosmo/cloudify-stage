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

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data);
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
        let DataTable = Stage.Basic.DataTable;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <DataTable fetchData={this.fetchGridData.bind(this)}
                       totalSize={this.props.data.total}
                       pageSize={this.props.widget.configuration.pageSize}
                       sortColumn={this.props.widget.configuration.sortColumn}
                       sortAscending={this.props.widget.configuration.sortAscending}
                       selectable={true}
                       className="nodesTable">

                    <DataTable.Column label="Name" name="id" width="20%"/>
                    <DataTable.Column label="Type" name="type" width="20%"/>
                    <DataTable.Column label="Blueprint" name="blueprint_id" width="10%" show={_.isEmpty(this.props.data.blueprintId)} />
                    <DataTable.Column label="Deployment" name="deployment_id" width="10%" show={_.isEmpty(this.props.data.deploymentId)} />
                    <DataTable.Column label="Contained in" name="host_id" width="7%"/>
                    <DataTable.Column label="Connected to" width="7%"/>
                    <DataTable.Column label="Creator" name='created_by' width="7%"/>
                    <DataTable.Column label="# Instances" name="number_of_instances" width="9%"/>
                    <DataTable.Column label="Groups" width="10%" show={!_.isEmpty(this.props.data.blueprintId) ||
                                                                   !_.isEmpty(this.props.data.deploymentId)} />

                    {
                        this.props.data.items.map((node) => {
                            return (
                                <DataTable.RowExpandable key={node.id + node.deployment_id} expanded={node.isSelected}>

                                    <DataTable.Row key={node.id + node.deployment_id} selected={node.isSelected} onClick={this._selectNode.bind(this, node)}>
                                        <DataTable.Data><a className='nodeName' href="javascript:void(0)">{node.id}</a></DataTable.Data>
                                        <DataTable.Data>{node.type}</DataTable.Data>
                                        <DataTable.Data>{node.blueprint_id}</DataTable.Data>
                                        <DataTable.Data>{node.deployment_id}</DataTable.Data>
                                        <DataTable.Data>{node.containedIn}</DataTable.Data>
                                        <DataTable.Data>{node.connectedTo}</DataTable.Data>
                                        <DataTable.Data>{node.created_by}</DataTable.Data>
                                        <DataTable.Data><div className="ui green horizontal label">{node.numberOfInstances}</div></DataTable.Data>
                                        <DataTable.Data>{node.groups}</DataTable.Data>
                                    </DataTable.Row>

                                    <DataTable.DataExpandable>
                                        <NodeInstancesTable instances={node.instances} widget={this.props.widget} toolbox={this.props.toolbox}>
                                        </NodeInstancesTable>
                                    </DataTable.DataExpandable>

                                </DataTable.RowExpandable>
                            );
                        })
                    }
                </DataTable>
            </div>

        );
    }
};
