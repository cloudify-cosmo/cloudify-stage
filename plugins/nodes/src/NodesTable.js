/**
 * Created by jakubniezgoda on 03/01/2017.
 */

import NodeInstancesTable from './NodeInstancesTable';

export default class extends React.Component {
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
        let Grid = Stage.Basic.Grid;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <Grid.Table fetchData={this.fetchGridData.bind(this)}
                            totalSize={this.props.data.total}
                            pageSize={this.props.widget.plugin.pageSize}
                            selectable={true}
                            className="nodesTable">

                    <Grid.Column label="Name" name="id" width="30%"/>
                    <Grid.Column label="Type" name="type" width="20%"/>
                    <Grid.Column label="Blueprint" name="blueprintId" width="10%" show={!this.props.data.blueprintId} />
                    <Grid.Column label="Deployment" name="deploymentId" width="10%" show={!this.props.data.deploymentId} />
                    <Grid.Column label="Contained in" name="containedIn" width="10%"/>
                    <Grid.Column label="Connected to" name="connectedTo" width="10%"/>
                    <Grid.Column label="# Instances" name="numberOfInstances" width="10%"/>

                    {
                        this.props.data.items.map((node) => {
                            return (
                                <Grid.RowWrapper key={node.id + node.deployment_id}>

                                    <Grid.Row key={node.id + node.deployment_id} select={node.isSelected} onClick={this._selectNode.bind(this, node)}>
                                        <Grid.Data><a className='nodeName' href="javascript:void(0)">{node.id}</a></Grid.Data>
                                        <Grid.Data>{node.type}</Grid.Data>
                                        <Grid.Data>{node.blueprint_id}</Grid.Data>
                                        <Grid.Data>{node.deployment_id}</Grid.Data>
                                        <Grid.Data>{node.containedIn}</Grid.Data>
                                        <Grid.Data>{node.connectedTo}</Grid.Data>
                                        <Grid.Data><div className="ui green horizontal label">{node.numberOfInstances}</div></Grid.Data>
                                    </Grid.Row>

                                    <Grid.RowExpandable key={node.id + node.deployment_id + '_expandableRow'} isExpanded={node.isSelected}>
                                        <NodeInstancesTable instances={node.instances} widget={this.props.widget} toolbox={this.props.toolbox}>
                                        </NodeInstancesTable>
                                    </Grid.RowExpandable>

                                </Grid.RowWrapper>
                            );
                        })
                    }

                </Grid.Table>

            </div>

        );
    }
};
