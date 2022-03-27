// @ts-nocheck File not migrated fully to TS
export default class OutputsTable extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            error: null,
            sortColumn: 'name',
            sortAscending: true
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('outputs:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentDidUpdate(prevProps) {
        const { data } = this.props;
        if (data.deploymentId !== prevProps.data.deploymentId || data.blueprintId !== prevProps.data.blueprintId) {
            this.refreshData();
        }
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('outputs:refresh', this.refreshData);
    }

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    render() {
        const { data } = this.props;
        const { error, sortAscending, sortColumn } = this.state;
        const { blueprintId, deploymentId, outputsAndCapabilities } = data;
        const NO_DATA_MESSAGE =
            "There are no Outputs/Capabilities available. Probably there's no deployment created, yet.";
        const { Button, DataTable, ErrorMessage, Header } = Stage.Basic;
        const ParameterValue = Stage.Common.Components.Parameter.Value;
        const ParameterValueDescription = Stage.Common.Components.Parameter.ValueDescription;

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
                        .thru(sortedData => (sortAscending ? sortedData : _.reverse(sortedData)))
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

OutputsTable.propTypes = {
    data: PropTypes.shape({
        blueprintId: PropTypes.string,
        deploymentId: PropTypes.string,
        outputsAndCapabilities: PropTypes.arrayOf(
            PropTypes.shape({
                description: PropTypes.string,
                isOutput: PropTypes.bool,
                name: PropTypes.string,
                value: Stage.PropTypes.AnyData
            })
        )
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
