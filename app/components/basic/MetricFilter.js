/**
 * Created by jakubniezgoda on 04/12/2017.
 */

import PropTypes from 'prop-types';
import React from 'react';

import Form from './form/Form';
import StageUtils from '../../utils/stageUtils';

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
    constructor(props, context) {
        super(props, context);

        this.state = MetricFilter.initialState(props);

        this.toolbox = StageUtils.getToolbox(() => {}, () => {}, null);
    }

    /**
     * propTypes
     *
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

    static initialState = props => ({
        metrics: [],
        metricId: props.value,
        error: null
    });

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.metricId !== this.props.value) {
            this.setState({ ...MetricFilter.initialState(this.props) });
            this._fetchMetrics();
        }
    }

    componentDidMount() {
        this._fetchMetrics();
        this.toolbox.getEventBus().on(`${this.props.filterContextName}:change`, this._fetchMetrics, this);
    }

    componentWillUnmount() {
        this.toolbox.getEventBus().off(`${this.props.filterContextName}:change`, this._fetchMetrics, this);
    }

    _fetchMetrics() {
        const filter = this.toolbox.getContext().getValue(this.props.filterContextName);
        const deploymentId = filter && filter.deploymentId;
        const nodeId = filter && filter.nodeId;
        const nodeInstanceId = filter && filter.nodeInstanceId;

        this.setState({ loading: true, metrics: [], error: null });
        const actions = new StageUtils.InfluxActions(this.toolbox);
        actions
            .doGetMetrics(deploymentId, nodeId, nodeInstanceId)
            .then(data => {
                const metrics = _.chain(data || {})
                    .map(item => ({ text: item, value: item, key: item }))
                    .unshift({ text: '', value: '', key: '' })
                    .uniqWith(_.isEqual)
                    .value();
                const newState = { loading: false, metrics };
                if (_.findIndex(metrics, metric => metric.value === this.state.metricId) === -1) {
                    newState.metricId = '';
                }
                this._setState(null, newState);
            })
            .catch(error => {
                const errorMessage = `Data fetching error: ${error.message}`;
                this.setState({ loading: false, metrics: [], error: errorMessage });
            });
    }

    _setState(event, newState) {
        this.setState(newState, () => {
            this.props.onChange(event, {
                name: this.props.name,
                value: this.state.metricId
            });
        });
    }

    _handleInputChange(event, field) {
        this._setState(event, { [field.name]: field.value });
    }

    render() {
        return (
            <Form.Field error={this.state.error}>
                <Form.Dropdown
                    search
                    selection
                    value={this.state.error ? '' : this.state.metricId}
                    placeholder={this.state.error || 'Metric'}
                    options={this.state.metrics}
                    onChange={this._handleInputChange.bind(this)}
                    name="metricId"
                    loading={this.state.loading}
                />
            </Form.Field>
        );
    }
}
