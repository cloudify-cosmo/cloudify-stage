/**
 * Created by jakubniezgoda on 20/03/2017.
 */
import PropTypes from 'prop-types';

import React from 'react';
import { Button, Grid, Label, List, Segment } from 'semantic-ui-react';
import { ApproveButton, CancelButton } from './modal/ModalButtons';
import Form from './form/Form';
import Popup from './Popup';

/**
 * TimeFilter is a component showing time range
 *
 * Both props: `value` and `defaultValue` are timeFilter objects:
 * ```
 * {
 *   range:'',      // time range label
 *   start:'',      // datetime string representing time range start, eg. '2017-08-06 16:00' or 'now()-15m'
 *   end:''         // datetime string representing time range end, eg. '2017-08-06 18:00' or 'now()'
 * }
 * ```
 *
 * ## Access
 * `Stage.Basic.TimeFilter`
 *
 * ## Usage
 * ![TimeFilter](manual/asset/form/InputTimeFilter_0.png)
 *
 * ```
 * <TimeFilter name='timeFilter' defaultValue={TimeFilter.EMPTY_VALUE} />
 * ```
 *
 */
export default class TimeFilter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = TimeFilter.initialState(props);
        _.extend(this._getStartDateState(this.state.start), this._getEndDateState(this.state.end));
    }

    /*
     *
     */
    static EMPTY_VALUE = {
        range: '',
        start: '',
        end: ''
    };

    /**
     * propTypes
     *
     * @property {string} name name of the field
     * @property {object} [defaultValue=TimeFilter.EMPTY_VALUE] timeFilter object ({range:'', start:'', end:''}) to be set when Reset button is clicked
     * @property {object} [value=TimeFilter.EMPTY_VALUE] timeFilter object to set input values
     * @property {object} [ranges={}] ranges object ({[range1] : {start: '', end:''}, [range2]: {start:'', end:''}, ...})
     * @property {Function} [onChange=(function (event, data) {});] function called on Apply button click, timeFilter object value is sent as data.value
     * @property {Function} [onCancel=(function (event, data) {});] function called on Cancel button click, timeFilter object value is sent as data.value
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        defaultValue: PropTypes.shape({
            range: PropTypes.string.isRequired,
            start: PropTypes.string.isRequired,
            end: PropTypes.string.isRequired
        }),
        value: PropTypes.shape({
            range: PropTypes.string.isRequired,
            start: PropTypes.string.isRequired,
            end: PropTypes.string.isRequired
        }),
        ranges: PropTypes.object,
        onChange: PropTypes.func,
        onCancel: PropTypes.func
    };

    static defaultProps = {
        defaultValue: TimeFilter.EMPTY_VALUE,
        value: TimeFilter.EMPTY_VALUE,
        ranges: {},
        onChange: () => {},
        onCancel: () => {}
    };

    static initialState = props => ({
        ...props.defaultValue,
        ...props.value,
        startDate: moment(),
        endDate: moment(),
        isOpen: false,
        dirty: false,
        startError: false,
        endError: false
    });

    static TIME_FORMAT = 'HH:mm';

    static DATE_FORMAT = 'YYYY-MM-DD';

    static DATETIME_FORMAT = `${TimeFilter.DATE_FORMAT} ${TimeFilter.TIME_FORMAT}`;

    static CUSTOM_RANGE = 'Custom Range';

    componentDidMount() {
        const state = TimeFilter.initialState(this.props);
        _.extend(state, this._getStartDateState(state.start), this._getEndDateState(state.end));
        this.setState(state);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    componentDidUpdate(prevProps, prevState) {
        const dirty = !_.isEqual(_.pick(this.state, Object.keys(TimeFilter.EMPTY_VALUE)), this.props.defaultValue);
        const { value } = this.props;
        const newState = {};
        if (prevState.dirty != dirty) {
            newState.dirty = dirty;
        }
        if (prevProps.value != value) {
            _.extend(newState, { ...value }, this._getStartDateState(value.start), this._getEndDateState(value.end));
        }
        if (!_.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    _handleInputChange(proxy, field, onStateUpdate) {
        this.setState({ [field.name]: field.value }, onStateUpdate);
    }

    _getStartDateState(start) {
        const startDate = { startError: false };
        if (this._isValidDate(start)) {
            const startMoment = moment(start || {});
            _.extend(startDate, { startDate: startMoment });
        }
        return startDate;
    }

    _getEndDateState(end) {
        const endDate = { endError: false };
        if (this._isValidDate(end)) {
            const endMoment = moment(end || {});
            _.extend(endDate, { endDate: endMoment });
        }
        return endDate;
    }

    _getStartState(startDate) {
        return { startError: false, start: moment(startDate).format(TimeFilter.DATETIME_FORMAT) };
    }

    _getEndState(endDate) {
        return { endError: false, end: moment(endDate).format(TimeFilter.DATETIME_FORMAT) };
    }

    _handleCustomInputChange(proxy, field) {
        this._handleInputChange(proxy, field, () => {
            const newState = { range: TimeFilter.CUSTOM_RANGE };
            if (_.isEqual(field.name, 'startDate')) {
                _.extend(newState, this._getStartState(field.value));
            } else if (_.isEqual(field.name, 'endDate')) {
                _.extend(newState, this._getEndState(field.value));
            } else if (_.isEqual(field.name, 'start')) {
                _.extend(newState, this._getStartDateState(field.value));
            } else if (_.isEqual(field.name, 'end')) {
                _.extend(newState, this._getEndDateState(field.value));
            }
            this.setState(newState);
        });
    }

    _isValidDate(dateTimeString) {
        return moment(dateTimeString || {}).isValid();
    }

    _getTimeFilterObject() {
        const timeFilter = {
            range: this.state.range
        };

        if (_.isEqual(this.state.range, TimeFilter.CUSTOM_RANGE)) {
            timeFilter.start = this.state.start;
            timeFilter.end = this.state.end;
        } else {
            timeFilter.start = _.get(this.props.ranges[this.state.range], 'start', '');
            timeFilter.end = _.get(this.props.ranges[this.state.range], 'end', '');
        }

        return timeFilter;
    }

    _getResetState(toDefaults) {
        const value = toDefaults ? this.props.defaultValue : this.props.value;
        const date = moment();

        return {
            ...value,
            startDate: date,
            endDate: date
        };
    }

    _isRangeSelected(range) {
        return _.isEqual(this.state.range, range);
    }

    _handleRangeButtonClick(proxy, field) {
        const { start } = this.props.ranges[field.name];
        const { end } = this.props.ranges[field.name];
        const startDate = this._getStartDateState(start);
        const endDate = this._getEndDateState(end);

        this.setState({
            range: field.name,
            start,
            end,
            ...startDate,
            ...endDate
        });
    }

    _handleCustomRangeButtonClick(proxy, field) {
        const newState = { range: field.name };
        _.extend(newState, this._getStartState(this.state.startDate));
        _.extend(newState, this._getEndState(this.state.endDate));
        this.setState(newState);
    }

    _handleResetButtonClick() {
        const resetState = this._getResetState(true);
        this.setState(resetState);
    }

    _handleApplyButtonClick(event, data) {
        const isStartValidDate = this._isValidDate(this.state.start);
        const isEndValidDate = this._isValidDate(this.state.end);
        const isValid = isStartValidDate && isEndValidDate;

        const newState = {
            startError: !isStartValidDate,
            endError: !isEndValidDate,
            isOpen: !isValid
        };

        this.setState(newState, () => {
            if (isValid) {
                this.props.onChange(event, { name: this.props.name, value: this._getTimeFilterObject() });
            }
        });
    }

    _handleCancelButtonClick(event, data) {
        const resetState = this._getResetState(false);
        this.setState({ ...resetState, isOpen: false }, () =>
            this.props.onCancel(event, { name: this.props.name, value: this._getTimeFilterObject() })
        );
    }

    render() {
        const from = this.state.start ? `from [${this.state.start}] ` : '';
        const until = this.state.end ? ` until [${this.state.end}]` : '';
        const inputValue = this._isRangeSelected(TimeFilter.CUSTOM_RANGE) ? `${from}${until}` : this.state.range;
        const inputFieldHint = (
            <div>
                ISO-8601-compatible date/time expected
                <br />
                Example:
                <br />
                2017-09-21 10:10
            </div>
        );

        return (
            <Popup basic hoverable={false} flowing open={this.state.isOpen}>
                <Popup.Trigger>
                    <Form.Input
                        value={inputValue}
                        placeholder={this.props.placeholder}
                        icon="dropdown"
                        fluid
                        onChange={() => {}}
                        onFocus={() => this.setState({ isOpen: true, startError: false, endError: false })}
                    />
                </Popup.Trigger>
                <Grid className="fixed-width">
                    <Grid.Row columns={_.isEmpty(this.props.ranges) ? 2 : 3}>
                        {!_.isEmpty(this.props.ranges) && (
                            <Grid.Column width={4}>
                                <Segment padded>
                                    <Label attached="top">Range:</Label>
                                    <List>
                                        {_.map(this.props.ranges, (obj, name) => (
                                            <List.Item key={name}>
                                                <Button
                                                    active={this._isRangeSelected(name)}
                                                    key={name}
                                                    name={name}
                                                    fluid
                                                    onClick={this._handleRangeButtonClick.bind(this)}
                                                >
                                                    {name}
                                                </Button>
                                            </List.Item>
                                        ))}
                                        <List.Item>
                                            <Button
                                                active={this._isRangeSelected(TimeFilter.CUSTOM_RANGE)}
                                                name={TimeFilter.CUSTOM_RANGE}
                                                fluid
                                                onClick={this._handleCustomRangeButtonClick.bind(this)}
                                            >
                                                {TimeFilter.CUSTOM_RANGE}
                                            </Button>
                                        </List.Item>
                                    </List>
                                </Segment>
                            </Grid.Column>
                        )}
                        <Grid.Column width={_.isEmpty(this.props.ranges) ? 8 : 6}>
                            <Segment padded>
                                <Label attached="top">From:</Label>

                                <List>
                                    <List.Item>
                                        <Popup wide>
                                            <Popup.Trigger>
                                                <Form.Input
                                                    fluid
                                                    name="start"
                                                    type="text"
                                                    value={this.state.start}
                                                    placeholder="Start date/time"
                                                    error={this.state.startError}
                                                    onChange={this._handleCustomInputChange.bind(this)}
                                                />
                                            </Popup.Trigger>
                                            {inputFieldHint}
                                        </Popup>
                                    </List.Item>
                                    <List.Item>
                                        <Form.InputDate
                                            name="startDate"
                                            value={this.state.startDate}
                                            onChange={this._handleCustomInputChange.bind(this)}
                                            startDate={this.state.startDate}
                                            endDate={this.state.endDate}
                                            maxDate={moment()}
                                        />
                                    </List.Item>
                                </List>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={_.isEmpty(this.props.ranges) ? 8 : 6}>
                            <Segment padded>
                                <Label attached="top">To:</Label>

                                <List>
                                    <List.Item>
                                        <Popup wide>
                                            <Popup.Trigger>
                                                <Form.Input
                                                    fluid
                                                    name="end"
                                                    type="text"
                                                    value={this.state.end}
                                                    placeholder="End date/time"
                                                    error={this.state.endError}
                                                    onChange={this._handleCustomInputChange.bind(this)}
                                                />
                                            </Popup.Trigger>
                                            {inputFieldHint}
                                        </Popup>
                                    </List.Item>
                                    <List.Item>
                                        <Form.InputDate
                                            name="endDate"
                                            value={this.state.endDate}
                                            onChange={this._handleCustomInputChange.bind(this)}
                                            startDate={this.state.startDate}
                                            endDate={this.state.endDate}
                                            maxDate={moment()}
                                        />
                                    </List.Item>
                                </List>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <div className="rightFloated top-padded-10">
                    <Button
                        onClick={this._handleResetButtonClick.bind(this)}
                        content="Reset"
                        icon="undo"
                        disabled={!this.state.dirty}
                    />
                    <CancelButton onClick={this._handleCancelButtonClick.bind(this)} className="cancel" />
                    <ApproveButton onClick={this._handleApplyButtonClick.bind(this)} content="Apply" positive />
                </div>
            </Popup>
        );
    }
}
