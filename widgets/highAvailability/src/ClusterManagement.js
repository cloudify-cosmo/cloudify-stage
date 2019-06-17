/**
 * Created by kinneretzin on 28/03/2017.
 */

import ClusterNodesList from './ClusterNodesList';

export default class ClusterManagement extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null
        }
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
        this.props.toolbox.getEventBus().on('cluster:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('cluster:refresh', this._refreshData);
    }

    render() {

        return (
            <div>
                {
                    <ClusterNodesList toolbox={this.props.toolbox} widget={this.props.widget} nodes={this.props.data.nodes}/>
                }
            </div>
        );
    }
}