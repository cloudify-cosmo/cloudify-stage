import { isEmpty, isEqual } from 'lodash';
import type { PollingTimeConfiguration } from '../../../app/utils/GenericConfig';

export interface InputItem {
    description: string;
    name: string;
    value: unknown;
}

export interface InputsTableProps {
    data: {
        blueprintId: string | string[] | null | undefined;
        deploymentId: string | string[] | null | undefined;
        items: InputItem[];
    };
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget<PollingTimeConfiguration>;
}

export const translateInputsWidget = Stage.Utils.getT('widgets.inputs');

export default class InputsTable extends React.Component<InputsTableProps> {
    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('inputs:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: InputsTableProps) {
        const { data, widget } = this.props;
        return !isEqual(widget, nextProps.widget) || !isEqual(data, nextProps.data);
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
        const NO_DATA_MESSAGE = translateInputsWidget('noData');
        const { DataTable, Header } = Stage.Basic;
        const ParameterValue = Stage.Common.Components.Parameter.Value;
        const ParameterValueDescription = Stage.Common.Components.Parameter.ValueDescription;
        const { data } = this.props;
        const { items: inputs } = data;
        const compareNames = (a: { name: string }, b: { name: string }) => {
            if (a.name > b.name) return 1;
            if (b.name > a.name) return -1;
            return 0;
        };

        return (
            <div>
                <DataTable className="inputsTable" noDataAvailable={isEmpty(inputs)} noDataMessage={NO_DATA_MESSAGE}>
                    <DataTable.Column label={translateInputsWidget('columns.name')} width="35%" />
                    <DataTable.Column
                        label={
                            <span>
                                {translateInputsWidget('columns.value')} <ParameterValueDescription />
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
