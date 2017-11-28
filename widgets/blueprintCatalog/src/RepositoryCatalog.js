/**
 * Created by pposel on 06/02/2017.
 */

let PropTypes = React.PropTypes;

export default class extends React.Component{

    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelect: PropTypes.func,
        onUpload: PropTypes.func,
        onReadme: PropTypes.func,
        readmeLoading: PropTypes.string
    };

    static defaultProps = {
        fetchData: ()=>{},
        onSelect: ()=>{},
        onUpload: ()=>{}
    };

    render(){
        var {DataSegment, Grid, Image, Button, Header} = Stage.Basic;

        var index=0;
        var catalogItems =
            this.props.data.items.map((item) => {
                return (
                    <Grid.Column key={item.id}>

                        <DataSegment.Item selected={item.isSelected} onClick={(event)=>{event.stopPropagation(); this.props.onSelect(item)}} className="fullHeight">
                            <Grid className="contentBlock">
                                <Grid.Row className="bottomDivider">
                                    <Grid.Column width="16">
                                        <Image src={Stage.Utils.url(item.image_url)}/>
                                        <Header><a href={item.html_url} target="_blank">{item.name}</a></Header>
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Column width="16">
                                    {item.description}
                                </Grid.Column>

                                <Grid.Row className="noPadded">
                                    <Grid.Column width="4"><h5 className="ui icon header">Created</h5></Grid.Column>
                                    <Grid.Column width="12">{item.created_at}</Grid.Column>
                                </Grid.Row>

                                <Grid.Row className="noPadded">
                                    <Grid.Column width="4"><h5 className="ui icon header">Updated</h5></Grid.Column>
                                    <Grid.Column width="12">{item.updated_at}</Grid.Column>
                                </Grid.Row>

                            </Grid>
                            <div>
                                <Button
                                    circular
                                    icon="info"
                                    loading={this.props.readmeLoading === item.name}
                                    className="readmeButton icon"
                                    onClick={event => {
                                        event.stopPropagation();
                                        this.props.onReadme(item.name);
                                    }}/>
                                <Button
                                    icon="upload"
                                    content="Upload"
                                    className="uploadButton labeled icon"
                                    onClick={event => {
                                        event.stopPropagation();
                                        this.props.onUpload(item.name);
                                    }}/>
                            </div>
                        </DataSegment.Item>

                    </Grid.Column>
                );
            });

        var catalogRows = [];
        var row = [];
        _.each(catalogItems,(catalogItem,index)=>{
            row.push(catalogItem);
            if ((index+1) % 3 === 0) {
                catalogRows.push(
                    <Grid.Row key={catalogRows.length+1} columns='3'>
                        {row}
                    </Grid.Row>
                );
                row =[];
            }
        });
        if (row.length > 0) {
            catalogRows.push(
                <Grid.Row key={catalogRows.length+1} columns='3'>
                    {row}
                </Grid.Row>
            );
        }

        return (
            <div>
                <DataSegment fetchSize={this.props.data.items.length}
                             totalSize={this.props.data.total}
                             pageSize={this.props.widget.configuration.pageSize}
                             fetchData={this.props.fetchData}
                             className="repositoryCatalog">

                    <Grid>
                        {catalogRows}
                    </Grid>

                </DataSegment>
            </div>
        );
    }
}
