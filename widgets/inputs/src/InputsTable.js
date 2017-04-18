/**
 * Created by pawelposel on 07/11/2016.
 */

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
        this.props.toolbox.getEventBus().on('inputs:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('inputs:refresh', this._refreshData);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data.deploymentId !== prevProps.data.deploymentId ||
            this.props.data.blueprintId !== prevProps.data.blueprintId) {
            this._refreshData();
        }
    }

    render() {
        let {ErrorMessage, DataTable, Popup, HighlightText, Header} = Stage.Basic;
        let {JsonUtils} = Stage.Common;
        let inputs = this.props.data.items;
        let compareNames = (a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <DataTable className="inputsTable" noDataAvailable={_.isEmpty(inputs)}>

                    <DataTable.Column label="Name" width="35%"/>
                    <DataTable.Column label="Value" width="65%"/>

                    {
                        inputs.sort(compareNames).map((input) =>
                            <DataTable.Row key={input.name}>
                                <DataTable.Data>
                                    <Header size="tiny">
                                        {input.name}
                                        <Header.Subheader>
                                            {input.description}
                                        </Header.Subheader>
                                    </Header>
                                </DataTable.Data>
                                <DataTable.Data>
                                    {input.value &&
                                        <Popup position='top left' wide>
                                            <Popup.Trigger><span>{JsonUtils.stringify(input.value, false)}</span></Popup.Trigger>
                                            <HighlightText
                                                className='json'>{JsonUtils.stringify(input.value, true)}</HighlightText>
                                        </Popup>
                                    }
                                </DataTable.Data>
                            </DataTable.Row>
                        )
                    }
                </DataTable>
            </div>
        );
    }
};
