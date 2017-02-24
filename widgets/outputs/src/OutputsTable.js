export default class extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('outputs:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('outputs:refresh',this._refreshData);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data.deploymentId !== prevProps.data.deploymentId) {
            this._refreshData();
        }
    }

    render() {
        var {ErrorMessage, DataTable} = Stage.Basic;
        let outputs = this.props.data.items;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <DataTable totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           className="outputsTable">

                    <DataTable.Column label="Name" width="30%"/>
                    <DataTable.Column label="Value" width="70%"/>

                    {
                        outputs.map((output) =>
                            <DataTable.Row key={output.id}>
                                <DataTable.Data>{output.id}</DataTable.Data>
                                <DataTable.Data>{output.value}</DataTable.Data>
                            </DataTable.Row>
                        )
                    }
                </DataTable>

            </div>

        );
    }
};
