export default class extends React.Component {

    constructor(props,context) {
        super(props,context);
        this.state = {}
    }

    _refreshData() {
        this.props.context.refresh();
    }

    componentDidMount() {
        this.props.context.getEventBus().on('outputs:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.context.getEventBus().off('outputs:refresh',this._refreshData);
    }

    render() {

        return (
            <div>
                {
                    this.state.error ?
                        <div className="ui error message" style={{"display":"block"}}>
                            <div className="header">Error Occured</div>
                            <p>{this.state.error}</p>
                        </div>
                        :
                        ''
                }
                <div>Outputs for deployment with id: {this.props.deploymentId || "NA"}</div>

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
                            return (
                                <tr key={item.id}>
                                    <td>{item.description}</td>
                                    <td>{item.value}</td>
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
