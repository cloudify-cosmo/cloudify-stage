/**
 * Created by kinneretzin on 18/10/2016.
 */

import MenuAction from './MenuAction';

let PropTypes = React.PropTypes;

export default class extends React.Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelectDeployment: PropTypes.func,
        onMenuAction: PropTypes.func

    };

    static defaultProps = {
        fetchData: ()=>{},
        onSelectDeployment: ()=>{},
        onMenuAction: ()=>{}
    };

    render() {
        var DataTable = Stage.Basic.DataTable;

        return (
            <DataTable fetchData={this.props.fetchData}
                        totalSize={this.props.data.total}
                        pageSize={this.props.widget.configuration.pageSize}
                        selectable={true}
                        className="deploymentTable">

                <DataTable.Column label="Name" name="id" width="25%"/>
                <DataTable.Column label="Blueprint" name="blueprint_id" width="25%"/>
                <DataTable.Column label="Created" name="created_at" width="18%"/>
                <DataTable.Column label="Updated" name="updated_at" width="18%"/>
                <DataTable.Column width="14%"/>

                {
                    this.props.data.items.map((item)=>{
                        return (

                            <DataTable.Row key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelectDeployment(item)}>
                                <DataTable.Data><a className='deploymentName' href="javascript:void(0)">{item.id}</a></DataTable.Data>
                                <DataTable.Data>{item.blueprint_id}</DataTable.Data>
                                <DataTable.Data>{item.created_at}</DataTable.Data>
                                <DataTable.Data>{item.updated_at}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    <MenuAction item={item} bordered={true} onSelectAction={this.props.onMenuAction}/>
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })
                }
            </DataTable>
        );
    }
}