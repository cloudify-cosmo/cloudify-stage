/**
 * Created by jakubniezgoda on 04/12/2017.
 */

import React, { PropTypes } from 'react';
import ErrorMessage from './ErrorMessage';
import Form from './form/Form';

/**
 * MetricFilter  - a simple component showing InfluxDB metric names filtered using context variable
 * (name of that variable is taken from filterContextName prop). Data (metrics) is dynamically fetched from InfluxDB.
 *
 * ## Access
 * `Stage.Basic.MetricFilter`
 *
 * ## Usage
 * ![MetricFilter](manual/asset/MetricFilter_0.png)
 *
 * ```
 * <MetricFilter name='metricFilter' value='' filterContextName='nodeFilter' />
 * ```
 *
 */
export default class MetricFilter extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = MetricFilter.initialState(props);

        this.toolbox = Stage.Utils.getToolbox(()=>{}, ()=>{}, null);
    }

    /**
     * propTypes
     * @property {string} name name of the field
     * @property {string} value value of the field (metric name)
     * @property {string} [filterContextName] name of the context variable which stores object containing the following keys (all are strings): blueprintId, deploymentId, nodeId, nodeInstance
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        filterContextName: PropTypes.string
    };

    static defaultProps = {
        filterContextName: 'nodeFilter'
    };

    static initialState = (props) => ({
        metrics: [],
        metricId: props.value
    });

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps)
            || !_.isEqual(this.state, nextState);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.metricId !== nextProps.value.metricId) {
            MetricFilter.initialState(nextProps);
        }
    }

    componentWillMount() {
        this._fetchMetrics();
    }

    componentDidMount() {
        this.toolbox.getEventBus().on(`${this.props.filterContextName}:change`, this._fetchMetrics, this);
    }

    componentWillUnmount() {
        this.toolbox.getEventBus().off(`${this.props.filterContextName}:change`, this._fetchMetrics, this);
    }

    _fetchMetrics() {
        let filter = this.toolbox.getContext().getValue(this.props.filterContextName);
        let deploymentId = filter && filter.deploymentId;
        let nodeId = filter && filter.nodeId;
        let nodeInstanceId = filter && filter.nodeInstanceId;

        this.setState({loading: true, metrics: []});
        let actions = new Stage.Common.InfluxActions(this.toolbox);
        actions.doGetMetrics(deploymentId, nodeId, nodeInstanceId)
            .then((data) => {
                let metrics = _.chain(data ||  {})
                               .map((item) => ({text: item, value: item, key: item}))
                               .unshift({text: '', value: '', key: ''})
                               .uniq()
                               .value();
                let newState = {loading: false, metrics};
                if (_.findIndex(metrics, (metric) => metric.value === this.state.metricId) === -1) {
                    newState.metricId = '';
                }
                this._setState(null, newState);
            })
            .catch((error) => {
                this.setState({loading: false, metrics: [], error: error.message});
            });
    }

    _setState(event, newState) {
        this.setState(newState, () => {
            this.props.onChange(event, {
                name: this.props.name,
                value: this.state.metricId
            })
        });
    }

    _handleInputChange(event, field) {
        this._setState(event, {[field.name]: field.value});
    }

    render() {
        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>
                <Form.Field>
                    <Form.Dropdown search selection value={this.state.metricId} placeholder="Metric"
                                   options={this.state.metrics} onChange={this._handleInputChange.bind(this)}
                                   name="metricId" loading={this.state.loading} />
                </Form.Field>
            </div>
        );
    }
}
