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
        var Table = Stage.Basic.Table;

        return (
            <Table fetchData={this.props.fetchData}
                        totalSize={this.props.data.total}
                        pageSize={this.props.widget.configuration.pageSize}
                        selectable={true}
                        className="deploymentTable">

                <Table.Column label="Name" name="id" width="25%"/>
                <Table.Column label="Blueprint" name="blueprint_id" width="25%"/>
                <Table.Column label="Created" name="created_at" width="18%"/>
                <Table.Column label="Updated" name="updated_at" width="18%"/>
                <Table.Column width="14%"/>

                {
                    this.props.data.items.map((item)=>{
                        return (

                            <Table.Row key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelectDeployment(item)}>
                                <Table.Data><a className='deploymentName' href="javascript:void(0)">{item.id}</a></Table.Data>
                                <Table.Data>{item.blueprint_id}</Table.Data>
                                <Table.Data>{item.created_at}</Table.Data>
                                <Table.Data>{item.updated_at}</Table.Data>
                                <Table.Data className="center aligned rowActions">
                                    <MenuAction item={item} bordered={true} onSelectAction={this.props.onMenuAction}/>
                                </Table.Data>
                            </Table.Row>
                        );
                    })
                }
            </Table>
        );
    }
}