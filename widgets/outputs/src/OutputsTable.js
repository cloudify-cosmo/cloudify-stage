export default class extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
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
        if (this.props.data.deploymentId !== prevProps.data.deploymentId) {
            this._refreshData();
        }
    }

    render() {
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <table className="ui very compact table outputsTable">
                    <thead>
                    <tr>
                        <th>Description</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.items.map((item)=>{
                            var value = '';
                            try {
                                value = JSON.stringify(item.value);
                            } catch (e) {
                                console.error('cannot parse output value',e);
                            }

                            return (
                                <tr key={item.id}>
                                    <td>{item.description}</td>
                                    <td>{value}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>

        );
    }
};
