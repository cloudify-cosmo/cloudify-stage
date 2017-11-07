/**
 * Created by Alex Laktionow on 9/14/17.
 */

export default class TestDataTable extends React.Component {

    _delete(item) {
        this.props.onDelete(item.id);
    }

    render() {
        var {DataTable, Button} = Stage.Basic;

        return (
            <div>
                <DataTable>
                    <DataTable.Column label="Id" width="30%"/>
                    <DataTable.Column label="Key" width="30%"/>
                    <DataTable.Column label="Value" width="30%"/>
                    <DataTable.Column label="Actions" width="10%"/>

                    {
                        this.props.data.items.map(item => {
                            return (
                                <DataTable.Row key={item.id}>
                                    <DataTable.Data>{item.id}</DataTable.Data>
                                    <DataTable.Data>{item.key}</DataTable.Data>
                                    <DataTable.Data>{item.value}</DataTable.Data>
                                    <DataTable.Data style={{textAlign: 'center'}}>
                                        <Button floated="right" icon="trash" onClick={this._delete.bind(this, item)}/>
                                    </DataTable.Data>
                                </DataTable.Row>
                            )})
                    }
                </DataTable>
            </div>
        );
    }
}

