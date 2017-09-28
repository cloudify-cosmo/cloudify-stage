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
 *   resolution:'', // time resolution value, an integer
 *   unit:''        // time resolution unit, eg. 'm' for minutes, 'h' for hours (InfluxDB syntax)
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

    /**
     * propTypes
     * @property {string} name name of the field
     * @property {object} defaultValue timeFilter object ({range:'', start:'', end:'', resolution:'', unit:''}) to be set when Reset button is clicked
     * @property {object} [value=InputTimeFilter.DEFAULTS] timeFilter object to set input values
     * @property {function} [onApply=(function () {});] function called on Apply button click, timeFilter object value is sent as argument
     * @property {function} [onCancel=(function () {});] function called on Cancel button click, timeFilter object value is sent as argument
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        defaultValue: PropTypes.object.isRequired,
        value: PropTypes.object,
        onApply: PropTypes.func,
        onCancel: PropTypes.func
    };

    static defaultProps = {
        value: InputTimeFilter.DEFAULT_VALUE,
        onApply: ()=>{},
        onCancel: ()=>{}
    };

    static TIME_FORMAT = 'HH:mm';
    static DATE_FORMAT = 'YYYY-MM-DD';

    static RANGES = {
        'Last 15 Minutes': {start: 'now()-15m', end: 'now()'},
        'Last 30 Minutes': {start: 'now()-30m', end: 'now()'},
        'Last Hour': {start: 'now()-1h', end: 'now()'},
        'Last 2 Hours': {start: 'now()-2h', end: 'now()'},
        'Last Day': {start: 'now()-1d', end: 'now()'},
        'Last Week': {start: 'now()-1w', end: 'now()'}
    };
    static CUSTOM_RANGE = 'Custom Range';

    static DEFAULT_VALUE = {
        range: 'Last 15 Minutes',
        start: 'now()-15m',
        end: 'now()',
        resolution: '1',
        unit: 'm'
    };
    static EMPTY_VALUE = {
        range: '',
        start: '',
        end: '',
        resolution: '1',
        unit: 'm'
    }

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

    static inputFieldHint = <div>Influx-compatible date/time expected<br />Examples:<br /> now() - 15m <br />2017-09-21 10:10</div>;

    static influxDateRegex = /^$|^(now\(\)|([0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}))([\s-+]+[0-9]+[usmhdw])*$/;
    static influxDurationRegex = /([-+])\s?([0-9]+)([smhdw])*/;

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
        let dirty = !_.isEqual(_.pick(this.state, Object.keys(InputTimeFilter.DEFAULT_VALUE)), this.props.defaultValue);
        if (prevState.dirty != dirty) {
            this.setState({dirty});
        }
    }

    _handleInputChange(proxy, field, onStateUpdate) {
        this.setState({[field.name]: field.value}, onStateUpdate);
    }

    _getStartTimeDateState(start) {
        let startTimeDate = {startError: false};
        let startMoment = moment(start);
        if (startMoment.isValid()) {
            _.extend(startTimeDate, {
                startDate: startMoment.toDate(),
                startTime: startMoment.format(InputTimeFilter.TIME_FORMAT)
            });
        }
        else if (InputTimeFilter._isValidInfluxDate(this.state.start)) {
            _.extend(startTimeDate, this._calculateDateWithOffsets(start, 'startDate', 'startTime'));
        }
        return startTimeDate;
    }

    _getEndTimeDateState(end) {
        let endTimeDate = {endError: false};
        let endMoment = moment(end);
        if (endMoment.isValid()) {
            _.extend(endTimeDate, {
                endDate: endMoment.toDate(),
                endTime: endMoment.format(InputTimeFilter.TIME_FORMAT)
            });
        }
        else if (InputTimeFilter._isValidInfluxDate(end)) {
            _.extend(endTimeDate, this._calculateDateWithOffsets(end, 'endDate', 'endTime'));
        }
        return endTimeDate;
    }

    _calculateDateWithOffsets(dateTime, stateDateField, stateTimeField){
        let matches = InputTimeFilter.influxDateRegex.exec(dateTime);
        let baseDate = moment(matches[1]).isValid() ? moment(matches[1]) : moment();

        matches.splice(0,1);
        _.forEach(matches, (match) => {
            if (InputTimeFilter.influxDurationRegex.test(match)) {
                let matchedGroups = InputTimeFilter.influxDurationRegex.exec(match);
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

    static _isValidInfluxDate(dateTimeString) {
        return InputTimeFilter.influxDateRegex.test(dateTimeString);
    }

    _getTimeFilterObject() {
        let timeFilter = {
            range: this.state.range,
            resolution: this.state.resolution,
            unit: this.state.unit
        };
        if (_.isEqual(this.state.range, InputTimeFilter.CUSTOM_RANGE)) {
            timeFilter.start = this.state.start;
            timeFilter.end = this.state.end;
        } else {
            timeFilter.start = _.get(InputTimeFilter.RANGES[this.state.range], 'start', '');
            timeFilter.end = _.get(InputTimeFilter.RANGES[this.state.range], 'end', '');
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
        let start = InputTimeFilter.RANGES[field.name].start;
        let end = InputTimeFilter.RANGES[field.name].end;
        let startTimeDate = this._getStartTimeDateState(start);
        let endTimeDate = this._getEndTimeDateState(end);
        let timeResolution = this._calculateTimeResolution(startTimeDate.startDate, endTimeDate.endDate);
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

    _handleApplyButtonClick() {
        let isStartValidInfluxDate = InputTimeFilter._isValidInfluxDate(this.state.start);
        let isEndValidInfluxDate = InputTimeFilter._isValidInfluxDate(this.state.end);

        let newState = {
            startError: isStartValidInfluxDate ? false : true,
            endError: isEndValidInfluxDate? false : true,
            isOpen: !(isStartValidInfluxDate && isEndValidInfluxDate)
        };

        this.setState(newState, () => this.props.onApply(this._getTimeFilterObject()));
    }

    _handleCancelButtonClick() {
        let resetState = this._getResetState(false);
        this.setState({...resetState, isOpen: false}, () => this.props.onCancel(this._getTimeFilterObject()));
    }

    render () {
        let inputValue = this._isRangeSelected(InputTimeFilter.CUSTOM_RANGE) ? `${this.state.start} - ${this.state.end}` : this.state.range;

        return (
            <Popup position='bottom left' hoverable={false} flowing open={this.state.isOpen}>
                <Popup.Trigger>
                    <Form.Input value={inputValue} placeholder='Click to set time range and resolution' icon='dropdown' fluid
                                onChange={()=>{}} onFocus={()=>this.setState({isOpen: true, startError: false, endError: false})} />
                </Popup.Trigger>
                <Grid columns={3}>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Segment padded>
                                <Label attached='top'>Range:</Label>
                                <List>
                                    {
                                        _.map(InputTimeFilter.RANGES, (obj, name) =>
                                            <List.Item key={name}>
                                                <Button active={this._isRangeSelected(name)} key={name} name={name} fluid
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
                        <Grid.Column width={6}>
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
                                            {InputTimeFilter.inputFieldHint}
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
                        <Grid.Column width={6}>
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
                                            {InputTimeFilter.inputFieldHint}
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
