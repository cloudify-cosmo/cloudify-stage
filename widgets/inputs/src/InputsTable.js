/**
 * Created by pawelposel on 07/11/2016.
 */

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            error: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.data, nextProps.data)
        );
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('inputs:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('inputs:refresh', this._refreshData);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.data.deploymentId !== prevProps.data.deploymentId ||
            this.props.data.blueprintId !== prevProps.data.blueprintId
        ) {
            this._refreshData();
        }
    }

    render() {
        const NO_DATA_MESSAGE = "There are no Inputs available. Probably there's no deployment created, yet.";
        const { DataTable, ErrorMessage, Header, ParameterValue, ParameterValueDescription } = Stage.Basic;

        const inputs = this.props.data.items;
        const compareNames = (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0);

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({ error: null })} autoHide />

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
