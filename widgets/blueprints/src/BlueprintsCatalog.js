/**
 * Created by kinneretzin on 08/01/2017.
 */


import UploadModal from './UploadBlueprintModal';

let PropTypes = React.PropTypes;

export default class BlueprintsCatalog extends React.Component{
    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelectBlueprint: PropTypes.func,
        onDeleteBlueprint: PropTypes.func,
        onCreateDeployment: PropTypes.func

    };

    static defaultProps = {
        fetchData: ()=>{},
        onSelectBlueprint: ()=>{},
        onDeleteBlueprint: ()=>{},
        onCreateDeployment: ()=>{}
    };

    render(){
        var {DataSegment, Grid, Image, Button, Label} = Stage.Basic;

        var index=0;
        var blueprintsItems =
            this.props.data.items.map((item) => {
                return (
                    <Grid.Column key={item.id}>

                        <DataSegment.Item selected={item.isSelected} className="fullHeight"
                                          onClick={(event)=>{event.stopPropagation(); this.props.onSelectBlueprint(item)}}>
                            <Grid>
                                <Grid.Row className="bottomDivider">
                                    <Grid.Column width="4"><Image src={`/ba/image/${item.id}`} centered={true}/></Grid.Column>
                                    <Grid.Column width="12">
                                        <h3 className="ui icon header verticalCenter">
                                            <a className="underline" href="javascript:void(0)">{item.id}</a>
                                        </h3>
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row className="noPadded">
                                    <Grid.Column width="7"><h5 className="ui icon header">Created</h5></Grid.Column>
                                    <Grid.Column width="9">{item.created_at}</Grid.Column>
                                </Grid.Row>

                                <Grid.Row className="noPadded">
                                    <Grid.Column width="7"><h5 className="ui icon header">Updated</h5></Grid.Column>
                                    <Grid.Column width="9">{item.updated_at}</Grid.Column>
                                </Grid.Row>

                                <Grid.Row className="noPadded">
                                    <Grid.Column width="7"><h5 className="ui icon header">Creator</h5></Grid.Column>
                                    <Grid.Column width="9">{item.created_by}</Grid.Column>
                                </Grid.Row>
                                <Grid.Row className="noPadded">
                                    <Grid.Column width="7"><h5 className="ui icon header"># Deployments</h5></Grid.Column>
                                    <Grid.Column width="9"><Label color="green" horizontal>{item.depCount}</Label></Grid.Column>
                                </Grid.Row>

                            </Grid>

                            <Grid.Column width="16">
                                <div style={{height:"50px"}}></div>
                            </Grid.Column>
                        </DataSegment.Item>

                        <div className="actionButtons">
                            <Button icon="trash" content="Delete" className="icon" basic
                                    onClick={(event)=>{event.stopPropagation(); this.props.onDeleteBlueprint(item)}}/>

                            <Button icon="rocket" content="Deploy" className="labeled icon"
                                    onClick={(event)=>{event.stopPropagation(); this.props.onCreateDeployment(item)}}/>
                        </div>

                    </Grid.Column>
                );
            });

        var blueprintsRows = [];
        var row = [];
        _.each(blueprintsItems,(blueprintItem,index)=>{
            row.push(blueprintItem);
            if ((index+1) % 3 === 0) {
                blueprintsRows.push(
                    <div key={blueprintsRows.length+1} className='three column row'>
                        {row}
                    </div>
                );
                row =[];
            }
        });
        if (row.length > 0) {
            blueprintsRows.push(
                <div key={blueprintsRows.length+1} className='three column row'>
                    {row}
                </div>
            );
        }


        return (
            <div>
                <DataSegment totalSize={this.props.data.total}
                         pageSize={this.props.widget.configuration.pageSize}
                         fetchData={this.props.fetchData} className="blueprintCatalog">

                    <DataSegment.Action>
                        <UploadModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
                    </DataSegment.Action>

                    <Grid>
                        {blueprintsRows}
                    </Grid>

                </DataSegment>
            </div>
        );
    }
}
