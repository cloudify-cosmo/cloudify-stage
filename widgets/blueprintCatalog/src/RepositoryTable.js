/**
 * Created by pposel on 08/02/2017.
 */

let PropTypes = React.PropTypes;

export default class extends React.Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelect: PropTypes.func,
        onUpload: PropTypes.func
    };

    static defaultProps = {
        fetchData: ()=>{},
        onSelect: ()=>{},
        onUpload: ()=>{}
    };

    render() {
        var {DataTable, Image, Icon} = Stage.Basic;

        return (
            <DataTable fetchData={this.props.fetchData}
                       pageSize={this.props.widget.configuration.pageSize}
                       sortColumn={this.props.widget.configuration.sortColumn}
                       sortAscending={this.props.widget.configuration.sortAscending}
                       fetchSize={this.props.data.items.length}
                       totalSize={this.props.data.total}
                       selectable={true}>

                <DataTable.Column label="Name" width="30%"/>
                <DataTable.Column label="Description" width="40%"/>
                <DataTable.Column label="Created" width="12%"/>
                <DataTable.Column label="Updated" width="12%"/>
                <DataTable.Column width="6%"/>

                {
                    this.props.data.items.map((item)=>{
                        return (
                            <DataTable.Row key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelect(item)}>
                                <DataTable.Data><Image src={item.image_url} width="30px" height="auto" inline/> <a href={item.html_url} target="_blank">{item.name}</a></DataTable.Data>
                                <DataTable.Data>{item.description}</DataTable.Data>
                                <DataTable.Data>{item.created_at}</DataTable.Data>
                                <DataTable.Data>{item.updated_at}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    <Icon name="upload" link title="Upload blueprint" onClick={(event)=>{event.stopPropagation();this.props.onUpload(item.name)}} bordered/>
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })
                }
            </DataTable>

        );
    }
}

