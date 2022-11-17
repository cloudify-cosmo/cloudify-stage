export interface InputsTableProps {
    data: {
        blueprintId: string | string[] | null | undefined;
        deploymentId: string | string[] | null | undefined;
        items: {
            description: string;
            name: string;
            value: any; // Stage.PropTypes.anydata
        }[];
    };
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget;
}

export interface InputsTableState {
    error: null; // Error is never different from null in this widget
}

export default class InputsTable extends React.Component<InputsTableProps, InputsTableState> {
    constructor(props: InputsTableProps, context: unknown) {
        super(props, context);
        this.state = {
            error: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('inputs:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: InputsTableProps, nextState: InputsTableState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentDidUpdate(prevProps: InputsTableProps) {
        const { data } = this.props;
        if (data.deploymentId !== prevProps.data.deploymentId || data.blueprintId !== prevProps.data.blueprintId) {
            this.refreshData();
        }
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('inputs:refresh', this.refreshData);
    }

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    render() {
        const NO_DATA_MESSAGE = "There are no Inputs available. Probably there's no deployment created, yet.";
        const { DataTable, ErrorMessage, Header } = Stage.Basic;
        const ParameterValue = Stage.Common.Components.Parameter.Value;
        const ParameterValueDescription = Stage.Common.Components.Parameter.ValueDescription;
        const { data } = this.props;
        const { error } = this.state;
        const { items: inputs } = data;
        const compareNames = (a: { name: string }, b: { name: string }) => {
            if (a.name > b.name) return 1;
            if (b.name > a.name) return -1;
            return 0;
        };

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable className="inputsTable" noDataAvailable={_.isEmpty(inputs)} noDataMessage={NO_DATA_MESSAGE}>
                    <DataTable.Column label="Name" width="35%" />
                    <DataTable.Column
                        label={
                            <span>
                                Value <ParameterValueDescription />
                            </span>
                        }
                        width="65%"
                    />

                    {inputs.sort(compareNames).map(input => (
                        <DataTable.Row key={input.name}>
                            <DataTable.Data>
                                <Header size="tiny">
                                    {input.name}
                                    <Header.Subheader>{input.description}</Header.Subheader>
                                </Header>
                            </DataTable.Data>
                            <DataTable.Data>
                                <ParameterValue value={input.value} />
                            </DataTable.Data>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </div>
        );
    }
}
