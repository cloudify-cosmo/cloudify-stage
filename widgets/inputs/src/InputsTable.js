/**
 * Created by pawelposel on 07/11/2016.
 */

export default class extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
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
        let {ErrorMessage, DataTable, Popup, HighlightText} = Stage.Basic;
        let {JsonUtils} = Stage.Common;
        let inputs = this.props.data.items;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <DataTable className="inputsTable">

                    <DataTable.Column label="Name" width="30%"/>
                    <DataTable.Column label="Value" width="70%"/>

                    {
                        inputs.map((input) =>
                            <DataTable.Row key={input.name}>
                                <DataTable.Data>
                                    {
                                        !_.isEmpty(input.description)
                                        ? <Popup positioning='top left' wide>
                                              <Popup.Trigger>{input.name}</Popup.Trigger>
                                              {input.description}
                                          </Popup>
                                        : input.name
                                    }
                                </DataTable.Data>
                                <DataTable.Data>
                                    <Popup positioning='top left' wide>
                                        <Popup.Trigger>{JsonUtils.stringify(input.value, false)}</Popup.Trigger>
                                        <HighlightText className='json'>{JsonUtils.stringify(input.value, true)}</HighlightText>
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
