export default class extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
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
        var {ErrorMessage, DataTable, Popup, HighlightText, Header} = Stage.Basic;
        let {JsonUtils} = Stage.Common;
        let outputs = this.props.data.items;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <DataTable className="outputsTable" noDataAvailable={_.isEmpty(outputs)}>

                    <DataTable.Column label="Name" width="35%"/>
                    <DataTable.Column label="Value" width="65%"/>
                    {
                        outputs.map((output) =>
                            <DataTable.Row key={output.name}>
                                <DataTable.Data>
                                    <Header size="tiny">
                                        {output.name}
                                        <Header.Subheader>
                                            {output.description}
                                        </Header.Subheader>
                                    </Header>
                                </DataTable.Data>
                                <DataTable.Data>
                                    <Popup positioning='top left' wide>
                                        <Popup.Trigger>{JsonUtils.stringify(output.value, false)}</Popup.Trigger>
                                        <HighlightText className='json'>{JsonUtils.stringify(output.value, true)}</HighlightText>
                                    </Popup>
                                </DataTable.Data>
                            </DataTable.Row>
                        )
                    }
                </DataTable>
            </div>
        );
    }
};
