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
        var Grid = Stage.Basic.Grid;

        return (
            <Grid.Table fetchData={this.props.fetchGridData}
                        totalSize={this.props.data.total}
                        pageSize={this.props.widget.plugin.pageSize}
                        selectable={true}
                        className="blueprintsTable">

                <Grid.Column label="Name" name="id" width="30%"/>
                <Grid.Column label="Created" name="created_at" width="20%"/>
                <Grid.Column label="Updated" name="updated_at" width="20%"/>
                <Grid.Column label="# Deployments" width="20%"/>
                <Grid.Column width="10%"/>

                {
                    this.props.data.items.map((item)=>{
                        return (
                            <Grid.Row key={item.id} select={item.isSelected} onClick={()=>this.props.onSelectBlueprint(item)}>
                                <Grid.Data><a className='blueprintName' href="javascript:void(0)">{item.id}</a></Grid.Data>
                                <Grid.Data>{item.created_at}</Grid.Data>
                                <Grid.Data>{item.updated_at}</Grid.Data>
                                <Grid.Data><div className="ui green horizontal label">{item.depCount}</div></Grid.Data>
                                <Grid.Data className="center aligned rowActions">
                                    <i className="rocket icon link bordered" title="Create deployment" onClick={(event)=>{event.stopPropagation();this.props.onCreateDeployment(item)}}></i>
                                    <i className="trash icon link bordered" title="Delete blueprint" onClick={(event)=>{event.stopPropagation();this.props.onDeleteBlueprint(item)}}></i>
                                </Grid.Data>
                            </Grid.Row>
                        );
                    })
                }

                <Grid.Action>
                    <UploadModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
                </Grid.Action>

            </Grid.Table>

        );
    }
}