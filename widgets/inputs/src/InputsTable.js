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
                            <th>Name</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <tr key={item.name}>
                                    <td>{item.name}</td>
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
