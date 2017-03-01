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
        if (this.props.data.deploymentId !== prevProps.data.deploymentId ||
            this.props.data.blueprintId !== prevProps.data.blueprintId) {
            this._refreshData();
        }
    }

    render() {
        var {ErrorMessage, DataTable, Popup} = Stage.Basic;
        let outputs = this.props.data.items;
        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <DataTable className="outputsTable">

                    <DataTable.Column label="Name" width="30%"/>
                    <DataTable.Column label="Value" width="70%"/>
                    {
                        outputs.map((output) =>
                            <DataTable.Row key={output.name}>
                                <DataTable.Data>
                                    {
                                        !_.isEmpty(output.description)
                                        ? <Popup trigger={<div>{output.name}</div>}
                                                 content={output.description}
                                                 positioning='top left' wide/>
                                        : output.name
                                    }
                                </DataTable.Data>
                                <DataTable.Data>{output.value}</DataTable.Data>
                            </DataTable.Row>
                        )
                    }
                </DataTable>
            </div>
        );
    }
};
