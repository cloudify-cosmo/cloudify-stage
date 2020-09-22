/**
 * Created by pawelposel on 07/11/2016.
 */

export default class InputsTable extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            error: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('inputs:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentDidUpdate(prevProps, prevState) {
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
        const { ParameterValue, ParameterValueDescription } = Stage.Common;
        const { data } = this.props;
        const { error } = this.state;
        const { items: inputs } = data;
        const compareNames = (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0);

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

InputsTable.propTypes = {
    data: PropTypes.shape({
        blueprintId: Stage.PropTypes.StringOrArray,
        deploymentId: Stage.PropTypes.StringOrArray,
        items: PropTypes.arrayOf(
            PropTypes.shape({ description: PropTypes.string, name: PropTypes.string, value: PropTypes.any })
        )
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
