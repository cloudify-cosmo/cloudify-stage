/**
 * Created by Alex Laktionow on 9/14/17.
 */

export default class TestDataTable extends React.Component {

    render() {
        var {DataTable, Button} = Stage.Basic;

        let tableRows = _.isArray(this.props.data) ? (
                this.props.data.map((item)=>{
                return (
                    <DataTable.Row key={item.id}>
                        <DataTable.Data>{item.id}</DataTable.Data>
                        <DataTable.Data>{item.key}</DataTable.Data>
                        <DataTable.Data>{JSON.stringify(item.value)}</DataTable.Data>
                        <DataTable.Data>
                            <Button floated="right" icon="trash" onClick={() => {
                                this.props.onDelete(this.props.widgetBackend, item.id);
                                this.props.refreshData();
                            }}/>
                        </DataTable.Data>
                    </DataTable.Row>
                )})
            ) : 'No records found';

        return (
            <div>
                <DataTable>
                    <DataTable.Column label="Id" width="30%"/>
                    <DataTable.Column label="Key" width="30%"/>
                    <DataTable.Column label="Value" width="30%"/>
                    <DataTable.Column label="Actions" width="10%"/>
                    {tableRows}
                </DataTable>
            </div>
        );
    }
}

