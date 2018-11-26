export default class extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            error: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
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
        const NO_DATA_MESSAGE = 'There are no Outputs/Capabilities available. Probably there\'s no deployment created, yet.';
        let {DataTable, ErrorMessage, Header, Label, ParameterValue, ParameterValueDescription} = Stage.Basic;

        const outputsAndCapabilities = this.props.data.outputsAndCapabilities;

        let compareNames = (a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                <DataTable className="outputsTable" noDataAvailable={_.isEmpty(outputsAndCapabilities)} noDataMessage={NO_DATA_MESSAGE}>

                    <DataTable.Column label="Name" width="35%"/>
                    <DataTable.Column label={<span>Value <ParameterValueDescription /></span>} width="65%"/>
                    {
                        outputsAndCapabilities.sort(compareNames).map((outputOrCapability) =>
                            <DataTable.Row key={outputOrCapability.name}>
                                <DataTable.Data>
                                    <Header size="tiny">
                                        {outputOrCapability.name}
                                        {
                                            outputOrCapability.isCapability &&
                                            <Label size='mini' color='blue' content='capability' />
                                        }
                                        <Header.Subheader>
                                            {outputOrCapability.description}
                                        </Header.Subheader>
                                    </Header>
                                </DataTable.Data>
                                <DataTable.Data>
                                    <ParameterValue value={outputOrCapability.value} />
                                </DataTable.Data>
                            </DataTable.Row>
                        )
                    }
                </DataTable>
            </div>
        );
    }
};
