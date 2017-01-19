/**
 * Created by kinneretzin on 08/01/2017.
 */

import UploadModal from './UploadBlueprintModal';

let PropTypes = React.PropTypes;

export default class BlueprintsTable extends React.Component{
    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        fetchGridData: PropTypes.func,
        onSelectBlueprint: PropTypes.func,
        onDeleteBlueprint: PropTypes.func,
        onCreateDeployment: PropTypes.func

    };

    static defaultProps = {
        fetchGridData: ()=>{},
        onSelectBlueprint: ()=>{},
        onDeleteBlueprint: ()=>{},
        onCreateDeployment: ()=>{}
    };

    render(){
        var Table = Stage.Basic.Table;

        return (
            <Table fetchData={this.props.fetchGridData}
                        totalSize={this.props.data.total}
                        pageSize={this.props.widget.pageSize}
                        selectable={true}
                        className="blueprintsTable">

                <Table.Column label="Name" name="id" width="30%"/>
                <Table.Column label="Created" name="created_at" width="20%"/>
                <Table.Column label="Updated" name="updated_at" width="20%"/>
                <Table.Column label="# Deployments" width="20%"/>
                <Table.Column width="10%"/>

                {
                    this.props.data.items.map((item)=>{
                        return (
                            <Table.Row key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelectBlueprint(item)}>
                                <Table.Data><a className='blueprintName' href="javascript:void(0)">{item.id}</a></Table.Data>
                                <Table.Data>{item.created_at}</Table.Data>
                                <Table.Data>{item.updated_at}</Table.Data>
                                <Table.Data><div className="ui green horizontal label">{item.depCount}</div></Table.Data>
                                <Table.Data className="center aligned rowActions">
                                    <i className="rocket icon link bordered" title="Create deployment" onClick={(event)=>{event.stopPropagation();this.props.onCreateDeployment(item)}}></i>
                                    <i className="trash icon link bordered" title="Delete blueprint" onClick={(event)=>{event.stopPropagation();this.props.onDeleteBlueprint(item)}}></i>
                                </Table.Data>
                            </Table.Row>
                        );
                    })
                }

                <Table.Action>
                    <UploadModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
                </Table.Action>

            </Table>

        );
    }
}