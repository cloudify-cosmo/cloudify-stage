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
        let Table = Stage.Basic.Table;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <Table fetchData={this.fetchGridData.bind(this)}
                            totalSize={this.props.data.total}
                            pageSize={this.props.widget.plugin.pageSize}
                            selectable={true}
                            className="nodesTable">

                    <Table.Column label="Type" name="type" width="20%"/>
                    <Table.Column label="Name" name="id" width="30%"/>
                    <Table.Column label="Blueprint" name="blueprintId" width="10%" show={!this.props.data.blueprintId} />
                    <Table.Column label="Deployment" name="deploymentId" width="10%" show={!this.props.data.deploymentId} />
                    <Table.Column label="Contained in" name="containedIn" width="10%"/>
                    <Table.Column label="Connected to" name="connectedTo" width="10%"/>
                    <Table.Column label="# Instances" name="numberOfInstances" width="10%"/>

                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <Table.Row key={item.id + item.deployment_id}>
                                    <Table.Data>{item.type}</Table.Data>
                                    <Table.Data><a className='nodeName' href="javascript:void(0)">{item.id}</a></Table.Data>
                                    <Table.Data>{item.blueprint_id}</Table.Data>
                                    <Table.Data>{item.deployment_id}</Table.Data>
                                    <Table.Data>{item.containedIn}</Table.Data>
                                    <Table.Data>{item.connectedTo}</Table.Data>
                                    <Table.Data><div className="ui green horizontal label">{item.numberOfInstances}</div></Table.Data>
                                </Table.Row>
                            );
                        })
                    }

                </Table>

            </div>

        );
    }
};
