/**
 * Created by jakubniezgoda on 03/01/2017.
 */

export default class extends React.Component {
    constructor(props,context) {
        super(props,context);

        this.state = {
        };
    }

    _refreshData() {
        this.props.toolbox.refresh();
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

                    <Grid.Column label="Type" name="type" width="20%"/>
                    <Grid.Column label="Name" name="id" width="30%"/>
                    <Grid.Column label="Blueprint" name="blueprintId" width="10%" show={!this.props.data.blueprintId} />
                    <Grid.Column label="Deployment" name="deploymentId" width="10%" show={!this.props.data.deploymentId} />
                    <Grid.Column label="Contained in" name="containedIn" width="10%"/>
                    <Grid.Column label="Connected to" name="connectedTo" width="10%"/>
                    <Grid.Column label="# Instances" name="numberOfInstances" width="10%"/>

                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <Grid.Row key={item.id + item.deployment_id}>
                                    <Grid.Data>{item.type}</Grid.Data>
                                    <Grid.Data><a className='nodeName' href="javascript:void(0)">{item.id}</a></Grid.Data>
                                    <Grid.Data>{item.blueprint_id}</Grid.Data>
                                    <Grid.Data>{item.deployment_id}</Grid.Data>
                                    <Grid.Data>{item.containedIn}</Grid.Data>
                                    <Grid.Data>{item.connectedTo}</Grid.Data>
                                    <Grid.Data><div className="ui green horizontal label">{item.numberOfInstances}</div></Grid.Data>
                                </Grid.Row>
                            );
                        })
                    }

                </Grid.Table>

            </div>

        );
    }
};
