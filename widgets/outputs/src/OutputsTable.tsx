import { chain, isEmpty, isEqual, pick, reverse } from 'lodash';
import type { OutputsAndCapabilitiesItem, OutputsTableConfiguration } from './types';

export interface OutputsTableProps {
    data: {
        blueprintId: string;
        deploymentId: string;
        outputsAndCapabilities: OutputsAndCapabilitiesItem[];
    };
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget<OutputsTableConfiguration>;
}

export interface OutputTableState {
    sortColumn: string;
    sortAscending: boolean;
}

export default class OutputsTable extends React.Component<OutputsTableProps, OutputTableState> {
    constructor(props: OutputsTableProps, context: unknown) {
        super(props, context);
        this.state = {
            sortColumn: 'name',
            sortAscending: true
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('outputs:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: OutputsTableProps, nextState: OutputTableState) {
        const { data, widget } = this.props;
        return !isEqual(widget, nextProps.widget) || !isEqual(this.state, nextState) || !isEqual(data, nextProps.data);
    }

    componentDidUpdate(prevProps: OutputsTableProps) {
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
        const { sortAscending, sortColumn } = this.state;
        const { blueprintId, deploymentId, outputsAndCapabilities } = data;
        const NO_DATA_MESSAGE = Stage.i18n.t('widgets.outputs.noData');
        const { Button, DataTable, Header } = Stage.Basic;
        const ParameterValue = Stage.Common.Components.Parameter.Value;
        const ParameterValueDescription = Stage.Common.Components.Parameter.ValueDescription;

        return (
            <div>
                <DataTable
                    className="outputsTable"
                    noDataAvailable={isEmpty(outputsAndCapabilities)}
                    noDataMessage={NO_DATA_MESSAGE}
                    fetchData={({ gridParams }) => this.setState(pick(gridParams, 'sortColumn', 'sortAscending'))}
                >
                    <DataTable.Column
                        label={Stage.i18n.t('widgets.outputs.tableColumns.name')}
                        name="name"
                        width="35%"
                    />
                    <DataTable.Column label={Stage.i18n.t('widgets.outputs.tableColumns.type')} name="isOutput" />
                    <DataTable.Column
                        label={
                            <span>
                                Value <ParameterValueDescription />
                            </span>
                        }
                        width="65%"
                    />
                    {chain(outputsAndCapabilities)
                        .sortBy(sortColumn)
                        .thru(sortedData => (sortAscending ? sortedData : reverse(sortedData)))
                        .map(outputOrCapability => (
                            <DataTable.Row key={outputOrCapability.name}>
                                <DataTable.Data>
                                    <Header size="tiny">
                                        {outputOrCapability.name}
                                        <Header.Subheader>{outputOrCapability.description}</Header.Subheader>
                                    </Header>
                                </DataTable.Data>
                                <DataTable.Data>
                                    {outputOrCapability.isOutput
                                        ? Stage.i18n.t('widgets.outputs.types.output')
                                        : Stage.i18n.t('widgets.outputs.types.capability')}
                                </DataTable.Data>
                                <DataTable.Data>
                                    <ParameterValue value={outputOrCapability.value} />
                                </DataTable.Data>
                            </DataTable.Row>
                        ))
                        .value()}
                    <DataTable.Action>
                        {!isEmpty(outputsAndCapabilities) && (
                            <Button
                                content={Stage.i18n.t('widgets.outputs.exportButton')}
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
