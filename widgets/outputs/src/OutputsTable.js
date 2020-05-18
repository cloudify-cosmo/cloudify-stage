export default class extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            error: null,
            sortColumn: 'name',
            sortAscending: true
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('outputs:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('outputs:refresh', this.refreshData);
    }

    componentDidUpdate(prevProps, prevState) {
        const { data } = this.props;
        if (data.deploymentId !== prevProps.data.deploymentId || data.blueprintId !== prevProps.data.blueprintId) {
            this.refreshData();
        }
    }

    render() {
        const {
            data: { blueprintId, deploymentId, outputsAndCapabilities }
        } = this.props;
        const { error, sortAscending, sortColumn } = this.state;
        const NO_DATA_MESSAGE =
            "There are no Outputs/Capabilities available. Probably there's no deployment created, yet.";
        const { Button, DataTable, ErrorMessage, Header } = Stage.Basic;
        const { ParameterValue, ParameterValueDescription } = Stage.Common;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    className="outputsTable"
                    noDataAvailable={_.isEmpty(outputsAndCapabilities)}
                    noDataMessage={NO_DATA_MESSAGE}
                    fetchData={({ gridParams }) => this.setState(_.pick(gridParams, 'sortColumn', 'sortAscending'))}
                >
                    <DataTable.Column label="Name" name="name" width="35%" />
                    <DataTable.Column label="Type" name="isOutput" />
                    <DataTable.Column
                        label={
                            <span>
                                Value <ParameterValueDescription />
                            </span>
                        }
                        width="65%"
                    />
                    {_.chain(outputsAndCapabilities)
                        .sortBy(sortColumn)
                        .thru(data => (sortAscending ? data : _.reverse(data)))
                        .map(outputOrCapability => (
                            <DataTable.Row key={outputOrCapability.name}>
                                <DataTable.Data>
                                    <Header size="tiny">
                                        {outputOrCapability.name}
                                        <Header.Subheader>{outputOrCapability.description}</Header.Subheader>
                                    </Header>
                                </DataTable.Data>
                                <DataTable.Data>{outputOrCapability.isOutput ? 'Output' : 'Capability'}</DataTable.Data>
                                <DataTable.Data>
                                    <ParameterValue value={outputOrCapability.value} />
                                </DataTable.Data>
                            </DataTable.Row>
                        ))
                        .value()}
                    <DataTable.Action>
                        {!_.isEmpty(outputsAndCapabilities) && (
                            <Button
                                content="Export to JSON"
                                icon="external share"
                                labelPosition="left"
                                onClick={() =>
                                    Stage.Utils.saveAs(
                                        new Blob([JSON.stringify(outputsAndCapabilities)]),
                                        `${deploymentId || blueprintId}-Outputs-Capabilities.json`
                                    )
                                }
                            />
                        )}
                    </DataTable.Action>
                </DataTable>
            </div>
        );
    }
}
