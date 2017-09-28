/**
 * Created by jakubniezgoda on 20/03/2017.
 */
import React, { PropTypes } from 'react';
import {Button, Dropdown, Grid, Label, List, Segment, Table} from 'semantic-ui-react';
import {ApproveButton, CancelButton} from '../modal/ModalButtons';
import Form from './Form';
import Popup from '../Popup';

/**
 * InputTimeFilter is a component showing time range and time resolution selectors
 *
 * Both props: `value` and `defaultValue` are timeFilter objects:
 * ```
 * {
 *   range:'',      // time range label
 *   start:'',      // datetime string representing time range start, eg. '2017-08-06 16:00' or 'now()-15m'
 *   end:'',        // datetime string representing time range end, eg. '2017-08-06 18:00' or 'now()'
 *   resolution:'', // time resolution value, an integer (only used when addTimeResolution is set to true)
 *   unit:''        // time resolution InfluxDB time syntax units, eg. 'm' for minutes, 'h' for hours (only used when addTimeResolution is set to true)
 * }
 * ```
 *
 * ## Access
 * `Stage.Basic.InputTimeFilter`
 *
 * ## Usage
 * ![InputTimeFilter](manual/asset/form/InputTimeFilter_0.png)
 *
 * ```
 * <InputTimeFilter name='timeFilter' defaultValue={InputTimeFilter.EMPTY_VALUE} />
 * ```
 *
 */
export default class InputTimeFilter extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = InputTimeFilter.initialState(props);
    }

    /*
     *
     */
    static EMPTY_VALUE = {
        range: '',
        start: '',
        end: '',
        resolution: 1,
        unit: 'm'
    }
    /*
     *
     */
    static INFLUX_DEFAULT_VALUE = {
        range: 'Last 15 Minutes',
        start: 'now()-15m',
        end: 'now()',
        resolution: 1,
        unit: 'm'
    };
    /*
     *
     */
    static INFLUX_RANGES = {
        'Last 15 Minutes': {start: 'now()-15m', end: 'now()'},
        'Last 30 Minutes': {start: 'now()-30m', end: 'now()'},
        'Last Hour': {start: 'now()-1h', end: 'now()'},
        'Last 2 Hours': {start: 'now()-2h', end: 'now()'},
        'Last Day': {start: 'now()-1d', end: 'now()'},
        'Last Week': {start: 'now()-1w', end: 'now()'}
    }
    /*
     *
     */
    static INFLUX_DATE_SYNTAX = 'influx';
    /*
     *
     */
    static ISO_8601_DATE_SYNTAX = 'iso8601';

    /**
     * propTypes
     * @property {string} name name of the field
     * @property {object} [defaultValue=InputTimeFilter.INFLUX_DEFAULT_VALUE] timeFilter object ({range:'', start:'', end:'', resolution:'', unit:''}) to be set when Reset button is clicked
     * @property {object} [value=InputTimeFilter.INFLUX_DEFAULT_VALUE] timeFilter object to set input values
     * @property {object} [ranges=InputTimeFilter.INFLUX_RANGES] ranges object ({[range1] : {start: '', end:''}, [range2]: {start:'', end:''}, ...})
     * @property {boolean} [addTimeResolution=true] adds time resolution segment
     * @property {string} [dateSyntax=InputTimeFilter.INFLUX_DATE_SYNTAX] defines validation method for input start/end date (allowed values: InputTimeFilter.INFLUX_DATE_SYNTAX, InputTimeFilter.ISO_8601_DATE_SYNTAX)
     * @property {function} [onApply=(function (event, data) {});] function called on Apply button click, timeFilter object value is sent as data.value
     * @property {function} [onCancel=(function (event, data) {});] function called on Cancel button click, timeFilter object value is sent as data.value
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        defaultValue: PropTypes.shape({
            range: PropTypes.string.isRequired,
            start: PropTypes.string.isRequired,
            end: PropTypes.string.isRequired,
            resolution: PropTypes.number,
            unit: PropTypes.string
        }),
        value: PropTypes.shape({
            range: PropTypes.string.isRequired,
            start: PropTypes.string.isRequired,
            end: PropTypes.string.isRequired,
            resolution: PropTypes.number,
            unit: PropTypes.string
        }),
        ranges: PropTypes.object,
        addTimeResolution: PropTypes.bool,
        dateSyntax: PropTypes.oneOf([InputTimeFilter.INFLUX_DATE_SYNTAX, InputTimeFilter.ISO_8601_DATE_SYNTAX]),
        onApply: PropTypes.func,
        onCancel: PropTypes.func
    };

    static defaultProps = {
        defaultValue: InputTimeFilter.INFLUX_DEFAULT_VALUE,
        value: InputTimeFilter.INFLUX_DEFAULT_VALUE,
        ranges: InputTimeFilter.INFLUX_RANGES,
        addTimeResolution: true,
        dateSyntax: InputTimeFilter.INFLUX_DATE_SYNTAX,
        onApply: (event, data)=>{},
        onCancel: (event, data)=>{}
    };

    static initialState = (props) => ({
        ...props.defaultValue,
        startDate: new Date(),
        startTime: '00:00',
        endDate: new Date(),
        endTime: '00:00',
        isOpen: false,
        dirty: false,
        startError: false,
        endError: false
    });

    static TIME_FORMAT = 'HH:mm';
    static DATE_FORMAT = 'YYYY-MM-DD';
    static DATETIME_FORMAT = `${InputTimeFilter.DATE_FORMAT} ${InputTimeFilter.TIME_FORMAT}`;
    static CUSTOM_RANGE = 'Custom Range';
    static INFLUX_DATE_REGEX = /^$|^(now\(\)|([0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}))([\s-+]+[0-9]+[usmhdw])*$/;
    static INFLUX_DURATION_REGEX = /([-+])\s?([0-9]+)([smhdw])*/;

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps)
            || !_.isEqual(this.state, nextState);
    }

    componentDidMount() {
        let state = InputTimeFilter.initialState(this.props);
        _.extend(state, this._getResetState(false));
        this.setState(state);
    }

    componentDidUpdate(prevProps, prevState) {
        let dirty = !_.isEqual(_.pick(this.state, Object.keys(InputTimeFilter.INFLUX_DEFAULT_VALUE)), this.props.defaultValue);
        if (prevState.dirty != dirty) {
            this.setState({dirty});
        }
    }

    _handleInputChange(proxy, field, onStateUpdate) {
        this.setState({[field.name]: field.value}, onStateUpdate);
    }

    _getStartTimeDateState(start) {
        let startTimeDate = {startError: false};
        if (this._isValidDate(start)) {
            if (this._isInfluxDateSyntax()) {
                _.extend(startTimeDate, this._calculateDateWithOffsets(start, 'startDate', 'startTime'));
            } else {
                let startMoment = moment(start || {});
                _.extend(startTimeDate, {
                    startDate: startMoment.toDate(),
                    startTime: startMoment.format(InputTimeFilter.TIME_FORMAT)
                });
            }
        }
        return startTimeDate;
    }

    _getEndTimeDateState(end) {
        let endTimeDate = {endError: false};
        if (this._isValidDate(end)) {
            if (this._isInfluxDateSyntax()) {
                _.extend(endTimeDate, this._calculateDateWithOffsets(end, 'endDate', 'endTime'));
            } else {
                let endMoment = moment(end || {});
                _.extend(endTimeDate, {
                    endDate: endMoment.toDate(),
                    endTime: endMoment.format(InputTimeFilter.TIME_FORMAT)
                });
            }
        }
        return endTimeDate;
    }

    _calculateDateWithOffsets(dateTime, stateDateField, stateTimeField){
        let matches = InputTimeFilter.INFLUX_DATE_REGEX.exec(dateTime);
        let baseDate = moment(matches[1]).isValid() ? moment(matches[1]) : moment();

        matches.splice(0,1);
        _.forEach(matches, (match) => {
            if (InputTimeFilter.INFLUX_DURATION_REGEX.test(match)) {
                let matchedGroups = InputTimeFilter.INFLUX_DURATION_REGEX.exec(match);
                let opSubtraction = _.isEqual(matchedGroups[1], '-');
                let opValue = matchedGroups[2];
                let opScale = matchedGroups[3];
                opSubtraction ? baseDate.subtract(opValue, opScale) : baseDate.add(opValue, opScale);
            }
        });

        return {
            [stateDateField]: baseDate.toDate(),
            [stateTimeField]: baseDate.format(InputTimeFilter.TIME_FORMAT)
        };
    }

    _calculateTimeResolution(startDate, endDate) {
        const EXPECTED_NUMBER_OF_POINTS = 50;
        const NUMBER_OF_MILLISECONDS_IN_SECOND = 1000;
        const NUMBER_OF_MILLISECONDS_IN_MINUTE = 1000*60;
        const NUMBER_OF_MILLISECONDS_IN_HOUR = 1000*60*60;
        const NUMBER_OF_MILLISECONDS_IN_DAY = 1000*60*60*24;
        const NUMBER_OF_MILLISECONDS_IN_WEEK = 1000*60*60*24*7;

        let newResolution = {};
        let startDateMoment = moment(startDate);
        let endDateMoment = moment(endDate);

        if (startDateMoment.isValid() && endDateMoment.isValid()) {
            let tickSize = endDateMoment.diff(startDateMoment) / EXPECTED_NUMBER_OF_POINTS;

            if (tickSize <= NUMBER_OF_MILLISECONDS_IN_SECOND) {
                newResolution = {resolution: Math.floor(tickSize), unit: 'ms'};
            } else if (tickSize <= NUMBER_OF_MILLISECONDS_IN_MINUTE) {
                newResolution = {resolution: Math.floor(tickSize / NUMBER_OF_MILLISECONDS_IN_SECOND), unit: 's'};
            } else if (tickSize <= NUMBER_OF_MILLISECONDS_IN_HOUR) {
                newResolution = {resolution: Math.floor(tickSize / NUMBER_OF_MILLISECONDS_IN_MINUTE), unit: 'm'};
            } else if (tickSize <= NUMBER_OF_MILLISECONDS_IN_DAY) {
                newResolution = {resolution: Math.floor(tickSize / NUMBER_OF_MILLISECONDS_IN_HOUR), unit: 'h'};
            } else if (tickSize <= NUMBER_OF_MILLISECONDS_IN_WEEK) {
                newResolution = {resolution: Math.floor(tickSize / NUMBER_OF_MILLISECONDS_IN_DAY), unit: 'd'};
            } else {
                newResolution = {resolution: Math.floor(tickSize / NUMBER_OF_MILLISECONDS_IN_WEEK), unit: 'w'};
            }
        }

        return newResolution;
    }

    _getStartState(startDate, startTime) {
        return {startError: false, start: `${moment(startDate).format(InputTimeFilter.DATE_FORMAT)} ${startTime}`};
    }

    _getEndState(endDate, endTime) {
        return {endError: false, end: `${moment(endDate).format(InputTimeFilter.DATE_FORMAT)} ${endTime}`};
    }

    _getDateWithTime(date, time) {
        let result = new Date(date);

        let [hours, minutes] = _.split(time, ':');
        result.setHours(hours, minutes);

        return result;
    }

    _handleCustomInputChange(proxy, field) {
        this._handleInputChange(proxy, field, () => {
            let newState = {range: InputTimeFilter.CUSTOM_RANGE};
            if (_.isEqual(field.name, 'startDate')) {
                _.extend(newState, this._getStartState(field.value, this.state.startTime));
            } else if (_.isEqual(field.name, 'startTime')) {
                let startDate = this._getDateWithTime(this.state.startDate, field.value);
                _.extend(newState, {startDate}, this._getStartState(startDate, field.value));
            } else if (_.isEqual(field.name, 'endDate')) {
                _.extend(newState, this._getEndState(field.value, this.state.endTime));
            } else if (_.isEqual(field.name, 'endTime')) {
                let endDate = this._getDateWithTime(this.state.endDate, field.value);
                _.extend(newState, {endDate}, this._getEndState(endDate, field.value));
            } else if (_.isEqual(field.name, 'start')) {
                _.extend(newState, this._getStartTimeDateState(field.value));
            } else if (_.isEqual(field.name, 'end')) {
                _.extend(newState, this._getEndTimeDateState(field.value));
            }
            this.setState(newState);
        });
    }

    _isInfluxDateSyntax() {
        return _.isEqual(this.props.dateSyntax, InputTimeFilter.INFLUX_DATE_SYNTAX);
    }

    _isValidDate(dateTimeString) {
        return this._isInfluxDateSyntax()
            ? InputTimeFilter.INFLUX_DATE_REGEX.test(dateTimeString)
            : moment(dateTimeString || {}).isValid()
    }

    _getTimeFilterObject() {
        let timeFilter = {
            range: this.state.range
        };
        if (this.props.addTimeResolution) {
            _.extend(timeFilter, {resolution: this.state.resolution, unit: this.state.unit});
        }
        if (_.isEqual(this.state.range, InputTimeFilter.CUSTOM_RANGE)) {
            timeFilter.start = this.state.start;
            timeFilter.end = this.state.end;
        } else {
            timeFilter.start = _.get(this.props.ranges[this.state.range], 'start', '');
            timeFilter.end = _.get(this.props.ranges[this.state.range], 'end', '');
        }

        return timeFilter;
    }

    _getResetState(toDefaults) {
        let value = (toDefaults ? this.props.defaultValue : this.props.value);
        let date = new Date();
        let time = moment(date).format(InputTimeFilter.TIME_FORMAT);

        return {
            ...value,
            startDate: date,
            startTime: time,
            endDate: date,
            endTime: time
        };
    }

    _isRangeSelected(range) {
        return _.isEqual(this.state.range, range);
    }

    _handleRangeButtonClick(proxy, field) {
        let start = this.props.ranges[field.name].start;
        let end = this.props.ranges[field.name].end;
        let startTimeDate = this._getStartTimeDateState(start);
        let endTimeDate = this._getEndTimeDateState(end);
        let timeResolution = this.props.addTimeResolution ? this._calculateTimeResolution(startTimeDate.startDate, endTimeDate.endDate) : {};
        this.setState({
            range: field.name,
            start,
            end,
            ...startTimeDate,
            ...endTimeDate,
            ...timeResolution
        });
    }

    _handleCustomRangeButtonClick(proxy, field) {
        let newState = {range: field.name};
        _.extend(newState, this._getStartState(this.state.startDate, this.state.startTime));
        _.extend(newState, this._getEndState(this.state.endDate, this.state.endTime));
        this.setState(newState);
    }

    _handleOptimizeButtonClick() {
        let timeResolution = this._calculateTimeResolution(this.state.startDate, this.state.endDate);
        this.setState(timeResolution);
    }

    _handleResetButtonClick() {
        let resetState = this._getResetState(true);
        this.setState(resetState);
    }

    _handleApplyButtonClick(event, data) {
        let isStartValidDate = this._isValidDate(this.state.start);
        let isEndValidDate = this._isValidDate(this.state.end);

        let newState = {
            startError: isStartValidDate ? false : true,
            endError: isEndValidDate? false : true,
            isOpen: !(isStartValidDate && isEndValidDate)
        };

        this.setState(newState, () => this.props.onApply(event, {name: this.props.name, value: this._getTimeFilterObject()}));
    }

    _handleCancelButtonClick(event, data) {
        let resetState = this._getResetState(false);
        this.setState({...resetState, isOpen: false}, () => this.props.onCancel(event, {name: this.props.name, value: this._getTimeFilterObject()}));
    }

    render () {
        let inputValue = this._isRangeSelected(InputTimeFilter.CUSTOM_RANGE) ? `${this.state.start} - ${this.state.end}` : this.state.range;
        let inputFieldHint = this._isInfluxDateSyntax()
            ? <div>Influx-compatible date/time expected<br />Examples:<br /> now() - 15m <br />2017-09-21 10:10</div>
            : <div>ISO-8601-compatible date/time expected<br />Example:<br />2017-09-21 10:10</div>

        return (
            <Popup position='bottom left' hoverable={false} flowing open={this.state.isOpen}>
                <Popup.Trigger>
                    <Form.Input value={inputValue} placeholder={this.props.placeholder} icon='dropdown' fluid
                                onChange={()=>{}} onFocus={()=>this.setState({isOpen: true, startError: false, endError: false})} />
                </Popup.Trigger>
                <Grid columns={this.props.ranges ? 3 : 2}>
                    <Grid.Row>
                        {
                            this.props.ranges &&
                            <Grid.Column width={4}>
                                <Segment padded>
                                    <Label attached='top'>Range:</Label>
                                    <List>
                                        {
                                            _.map(this.props.ranges, (obj, name) =>
                                                <List.Item key={name}>
                                                    <Button active={this._isRangeSelected(name)} key={name} name={name}
                                                            fluid
                                                            onClick={this._handleRangeButtonClick.bind(this)}>
                                                        {name}
                                                    </Button>
                                                </List.Item>
                                            )
                                        }
                                        <List.Item>
                                            <Button active={this._isRangeSelected(InputTimeFilter.CUSTOM_RANGE)}
                                                    name={InputTimeFilter.CUSTOM_RANGE} fluid
                                                    onClick={this._handleCustomRangeButtonClick.bind(this)}>
                                                {InputTimeFilter.CUSTOM_RANGE}
                                            </Button>
                                        </List.Item>
                                    </List>
                                </Segment>
                            </Grid.Column>
                        }
                        <Grid.Column width={this.props.ranges ? 6 : 8}>
                            <Segment padded>
                                <Label attached='top'>From:</Label>

                                <List>
                                    <List.Item>
                                        <Popup wide>
                                            <Popup.Trigger>
                                                <Form.Input fluid name='start' type='text' value={this.state.start}
                                                            placeholder='Start date/time'
                                                            error={this.state.startError}
                                                            onChange={this._handleCustomInputChange.bind(this)}/>
                                            </Popup.Trigger>
                                            {inputFieldHint}
                                        </Popup>
                                    </List.Item>
                                    <List.Item>
                                        <Form.InputDate name='startDate' inline={true} maxDate={new Date()}
                                                        endDate={this.state.endDate} value={this.state.startDate}
                                                        onChange={this._handleCustomInputChange.bind(this)} />
                                    </List.Item>
                                    <List.Item>
                                        <Form.InputTime name='startTime' value={this.state.startTime}
                                                        onChange={this._handleCustomInputChange.bind(this)} />
                                    </List.Item>
                                </List>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={this.props.ranges ? 6 : 8}>
                            <Segment padded>
                                <Label attached='top'>To:</Label>

                                <List>
                                    <List.Item>
                                        <Popup wide>
                                            <Popup.Trigger>
                                                <Form.Input fluid name='end' type='text' value={this.state.end}
                                                            placeholder='End date/time'
                                                            error={this.state.endError}
                                                            onChange={this._handleCustomInputChange.bind(this)} />
                                            </Popup.Trigger>
                                            {inputFieldHint}
                                        </Popup>
                                    </List.Item>
                                    <List.Item>
                                        <Form.InputDate name='endDate' inline={true} maxDate={new Date()}
                                                        startDate={this.state.startDate} value={this.state.endDate}
                                                        onChange={this._handleCustomInputChange.bind(this)} />
                                    </List.Item>
                                    <List.Item>
                                        <Form.InputTime name='endTime' value={this.state.endTime}
                                                        onChange={this._handleCustomInputChange.bind(this)} />
                                    </List.Item>
                                </List>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    {
                        this.props.addTimeResolution &&
                        <Grid.Row>
                            <Grid.Column width={12} floated='right'>
                                <Segment padded>
                                    <Label attached='top'>Resolution:</Label>
                                    <Table compact basic='very'>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <Form.Input type='number' name="resolution" fluid
                                                                max={Stage.Common.TimeConsts.MAX_TIME_RESOLUTION_VALUE}
                                                                min={Stage.Common.TimeConsts.MIN_TIME_RESOLUTION_VALUE}
                                                                value={this.state.resolution} onChange={this._handleInputChange.bind(this)} />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Dropdown search options={Stage.Common.TimeConsts.TIME_RESOLUTION_UNITS} name="unit" selection
                                                              fluid value={this.state.unit} onChange={this._handleInputChange.bind(this)} />
                                                </Table.Cell>
                                                <Table.Cell collapsing>
                                                    <Button onClick={this._handleOptimizeButtonClick.bind(this)} content='Optimize' icon='refresh'/>
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    }
                </Grid>
                <div className='rightFloated'>
                    <Button onClick={this._handleResetButtonClick.bind(this)} content="Reset" icon="undo" disabled={!this.state.dirty}/>
                    <CancelButton onClick={this._handleCancelButtonClick.bind(this)} className='cancel' />
                    <ApproveButton onClick={this._handleApplyButtonClick.bind(this)} content='Apply' positive />
                </div>
            </Popup>
        );
    }
}
