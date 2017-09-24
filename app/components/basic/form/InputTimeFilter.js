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
        dirty: false
    });

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps)
            || !_.isEqual(this.state, nextState);
    }

    componentDidMount() {
        this.setState(InputTimeFilter.initialState(this.props));
        this._resetFilter(false);
    }

    componentDidUpdate(prevProps, prevState) {
        this.setState({dirty: !_.isEqual(_.pick(this.state, Object.keys(InputTimeFilter.DEFAULT_VALUE)), this.props.defaultValue)});
    }

    _handleInputChange(proxy, field, onStateUpdate) {
        this.setState({[field.name]: field.value}, onStateUpdate);
    }

    _resetStartEndDateTimeState() {
        let date = new Date();
        let time = moment(date).format(InputTimeFilter.TIME_FORMAT);
        this.setState({
            startDate: date,
            startTime: time,
            endDate: date,
            endTime: time
        });
    };

    _setStartTimeDateState() {
        let startMoment = moment(this.state.start);
        if (startMoment.isValid()) {
            this.setState({
                startDate: startMoment.toDate(),
                startTime: startMoment.format(InputTimeFilter.TIME_FORMAT)
            });
        }
    }

    _setEndTimeDateState() {
        let endMoment = moment(this.state.end);
        if (endMoment.isValid()) {
            this.setState({
                endDate: endMoment.toDate(),
                endTime: endMoment.format(InputTimeFilter.TIME_FORMAT)
            });
        }
    }

    _setStartState() {
        this.setState({start: `${moment(this.state.startDate).format(InputTimeFilter.DATE_FORMAT)} ${this.state.startTime}`});
    }

    _setEndState() {
        this.setState({end: `${moment(this.state.endDate).format(InputTimeFilter.DATE_FORMAT)} ${this.state.endTime}`});
    }

    _handleCustomInputChange(proxy, field) {
        this._handleInputChange(proxy, field, () => {
            if (_.isEqual(field.name, 'startDate') || _.isEqual(field.name, 'startTime')) {
                this._setStartState();
            } else if (_.isEqual(field.name, 'endDate') || _.isEqual(field.name, 'endTime')) {
                this._setEndState();
            } else if (_.isEqual(field.name, 'start')) {
                this._setStartTimeDateState();
            } else if (_.isEqual(field.name, 'end')) {
                this._setEndTimeDateState();
            }
            this.setState({range: InputTimeFilter.CUSTOM_RANGE});
        });
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

    _resetFilter(toDefaults) {
        let state = (toDefaults ? this.props.defaultValue : this.props.value);
        this.setState({...state},
            () => this._resetStartEndDateTimeState());
    }

    _isRangeSelected(range) {
        return _.isEqual(this.state.range, range);
    }

    _handleRangeButtonClick(proxy, field) {
        this.setState({
            range: field.name,
            start: InputTimeFilter.RANGES[field.name].start,
            end: InputTimeFilter.RANGES[field.name].end,
        }, () => this._resetStartEndDateTimeState());
    }

    _handleCustomRangeButtonClick(proxy, field) {
        this._setStartState();
        this._setEndState();
        this.setState({range: field.name});
    }

    _handleApplyButtonClick() {
        this.setState({isOpen: false}, () => this.props.onApply(this._getTimeFilterObject()));
    }

    _handleCancelButtonClick() {
        this._resetFilter(false);
        this.setState({isOpen: false}, () => this.props.onCancel(this._getTimeFilterObject()));
    }

    render () {
        let inputValue = this._isRangeSelected(InputTimeFilter.CUSTOM_RANGE) ? `${this.state.start} - ${this.state.end}` : this.state.range;

        return (
            <Popup position='bottom left' hoverable={false} flowing open={this.state.isOpen}>
                <Popup.Trigger>
                    <Form.Input value={inputValue} placeholder='Click to set time range and resolution'
                                onChange={()=>{}} onFocus={()=>this.setState({isOpen: true})} icon='dropdown' fluid />
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
                                        <Form.Input fluid name='start' type='text' value={this.state.start}
                                                    placeholder='Start date/time'
                                                    onChange={this._handleCustomInputChange.bind(this)} />
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
                                        <Form.Input fluid name='end' type='text' value={this.state.end}
                                                    placeholder='End date/time'
                                                    onChange={this._handleCustomInputChange.bind(this)} />
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
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <div className='rightFloated'>
                    <Button onClick={this._resetFilter.bind(this, true)} content="Reset" icon="undo" disabled={!this.state.dirty}/>
                    <CancelButton onClick={this._handleCancelButtonClick.bind(this)} className='cancel' />
                    <ApproveButton onClick={this._handleApplyButtonClick.bind(this)} content='Apply' positive />
                </div>
            </Popup>
        );
    }
}
