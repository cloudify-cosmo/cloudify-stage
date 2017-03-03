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
        var {ErrorMessage, DataTable, Popup} = Stage.Basic;
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
                                        ? <Popup trigger={<div>{input.name}</div>}
                                                 content={input.description}
                                                 positioning='top left' wide/>
                                        : input.name
                                    }
                                </DataTable.Data>
                                <DataTable.Data>{input.value}</DataTable.Data>
                            </DataTable.Row>
                        )
                    }
                </DataTable>
            </div>
        );
    }
};
