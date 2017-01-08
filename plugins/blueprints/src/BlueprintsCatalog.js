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
        var Segment = Stage.Basic.Segment;

        var blueprintsItems =
            this.props.data.items.map((item,index) => {
                var imageStyle = {
                    background: 'url(/plugins/blueprints/blueprintImages/bp'+((index%8)+1)+'.png)',
                    backgroundSize: 'contain',
                    position: 'absolute',
                    left: 0,right: 0, top: 0, bottom:0,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '50%',
                    margin: '5px'
                };
                return (
                    <div className="column" key={item.id}>

                        <Segment.Item  select={item.isSelected}
                                      onClick={()=>this.props.onSelectBlueprint(item)}>
                            <div className="ui grid">
                                <div className="five wide center aligned column rightDivider">
                                    <div style={imageStyle}/>
                                </div>
                                <div className="eleven wide column">
                                    <h3><a className='blueprintName' href="javascript:void(0)">{item.id}</a></h3>

                                    <div className='ui grid'>
                                        <div className='two column row'>
                                            <div className='column'>Created</div>
                                            <div className='column'>{item.created_at}</div>
                                        </div>
                                        <div className='two column row'>
                                            <div className='column'>Updated</div>
                                            <div className='column'>{item.updated_at}</div>
                                        </div>
                                        <div className='two column row'>
                                            <div className='column'># Deployments</div>
                                            <div className='column'><div className="ui green horizontal label">{item.depCount}</div></div>
                                        </div>

                                        <div className='row'>
                                            <div className='ui grid column'>

                                                <div className='eight wide column left floated '>
                                                    <button className="ui labeled icon button " onClick={(event)=>{event.stopPropagation();this.props.onCreateDeployment(item)}}>
                                                        <i className="rocket icon"></i>
                                                        Deploy
                                                    </button>
                                                </div>
                                                <div className='eight wide column right floated right aligned'>
                                                    <h3 style={{lineHeight: '40px',textDecoration: 'underline'}}>
                                                        <a className='' href="javascript:void(0)" onClick={(event)=>{event.stopPropagation();this.props.onDeleteBlueprint(item)}}>
                                                            <i className="trash icon link"></i>
                                                            Delete
                                                        </a>
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </Segment.Item>
                    </div>
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
                <div style={{padding: '10px 0px'}}>
                    <UploadModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
                </div>
                <Segment.List totalSize={this.props.data.total}
                              pageSize={this.props.widget.plugin.pageSize}
                              fetchData={this.props.fetchData}>
                    <div className="ui grid">
                        {blueprintsRows}
                    </div>
                </Segment.List>
            </div>
        );
    }
}
