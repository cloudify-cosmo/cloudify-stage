/**
 * Created by kinneretzin on 15/11/2016.
 */

import React, { Component, PropTypes } from 'react';
import {Icon, Popup, Input, Checkbox, Dropdown, Form} from '../index'
import EdiTable from './EdiTable';
import InputTimeFilter from './InputTimeFilter';

/**
 * GenericField is a generic component which can be used as different input fields in {@link Form} component
 *
 * It is used widely in widget configuration modal. Constant values used for defining field type are described below.
 *
 * ## Access
 * `Stage.Basic.Form.GenericField`
 *
 * ## Usage
 *
 * ### String input field
 * ![GenericField](manual/asset/form/GenericField_1.png)
 * ```
 * <GenericField name="stringTest" type={GenericField.STRING_TYPE}
 *               label="STRING_TYPE" icon="rocket" placeholder="Write text..." />
 * ```
 *
 * ### Password input field
 * ![GenericField](manual/asset/form/GenericField_2.png)
 * ```
 * <GenericField name="passwordTest" type={GenericField.PASSWORD_TYPE}
 *               label="PASSWORD_TYPE" icon="key" value="" />
 * ```
 *
 * ### Number input field
 * ![GenericField](manual/asset/form/GenericField_3.png)
 * ```
 * <GenericField name="numberTest" type={GenericField.NUMBER_TYPE}
 *               label="NUMBER_TYPE" value="5" min={1} max={10} />
 * ```
 *
 * ### Boolean input field
 * ![GenericField](manual/asset/form/GenericField_4.png)
 * ```
 * <GenericField name="booleanTest" type={GenericField.BOOLEAN_TYPE}
 *               label="BOOLEAN_TYPE" value="true" />
 * ```
 *
 * ### List input field
 * ![GenericField](manual/asset/form/GenericField_5.png)
 * ```
 * <GenericField name="listTest" type={GenericField.LIST_TYPE}
 *               label="LIST_TYPE" items={['a','b','c']} value='b' />
 * ```
 *
 * ### Number list input field
 * ![GenericField](manual/asset/form/GenericField_6.png)
 * ```
 * <GenericField name="numberListTest" type={GenericField.NUMBER_LIST_TYPE}
 *               label="NUMBER_LIST_TYPE" items={[1,2,3]} value={2} />
 * ```
 *
 * ### Multi select list input field
 * ![GenericField](manual/asset/form/GenericField_7.png)
 * ```
 * <GenericField name="multiSelectListTest" type={GenericField.MULTI_SELECT_LIST_TYPE}
 *               label="MULTI_SELECT_LIST_TYPE" value={[2,3,4]} items={[1,2,3,{value:4, name:'four'}, {value:5, name:'five'}]} />
 * ```
 *
 * ### Editable list input field
 * ![GenericField](manual/asset/form/GenericField_8.png)
 * ```
 * <GenericField name="editableListTest" type={GenericField.EDITABLE_LIST_TYPE}
 *               label="EDITABLE_LIST_TYPE" value='b' items={['a','b','c']}/>
 * ```
 *
 * ### Editable number list input field
 * ![GenericField](manual/asset/form/GenericField_9.png)
 * ```
 * <GenericField name="numberEditableListTest" type={GenericField.NUMBER_EDITABLE_LIST_TYPE}
 *               label="NUMBER_EDITABLE_LIST_TYPE" items={[1,2,3]} value={2}/>
 * ```
 *
 * ### Editable table field
 * ![GenericField](manual/asset/form/GenericField_10.png)
 * ```
 * <GenericField name="editableTable" type={GenericField.EDITABLE_TABLE_TYPE}
 *               label="EDITABLE_TABLE_TYPE"
 *               items={[
 *                 {name: "metric", label: 'Metric', default: "", type: Stage.Basic.GenericField.EDITABLE_LIST_TYPE, description: "Name of the metric to be presented on the graph",
 *                  items: ["", "cpu_total_system", "cpu_total_user", "memory_MemFree", "memory_SwapFree", "loadavg_processes_running"]},
 *                 {name: 'label', label: 'Label', default: "", type: Stage.Basic.GenericField.STRING_TYPE, description: "Chart label"},
 *                 {name: 'unit', label: 'Unit', default: "", type: Stage.Basic.GenericField.STRING_TYPE, description: "Chart data unit"}
 *               ]}
 *               max={3} />
 * ```
 *
 * ### Time filter input field
 * ![GenericField](manual/asset/form/GenericField_11.png)
 * ```
 * <GenericField name="timeFilterTest" type={GenericField.TIME_FILTER_TYPE}
 *               label="TIME_FILTER_TYPE" value={Stage.Basic.InputTimeFilter.INFLUX_DEFAULT_VALUE} />
 * ```
 */


export default class GenericField extends Component {

    /**
     * alphanumeric input field
     */
    static STRING_TYPE = 'string';

    /**
     * password input field
     */
    static PASSWORD_TYPE = 'password';

    /**
     * numeric input field
     */
    static NUMBER_TYPE = 'number';

    /**
     * two-state input field
     */
    static BOOLEAN_TYPE = 'boolean';

    /**
     * dropdown alphanumeric list field
     */
    static LIST_TYPE = 'list';

    /**
     * dropdown numeric list field
     */
    static NUMBER_LIST_TYPE = 'numberList';

    /**
     * dropdown multiselection list
     */
    static MULTI_SELECT_LIST_TYPE = 'multiSelectList';

    /**
     * dropdown editable list
     */
    static EDITABLE_LIST_TYPE = 'editableList';

    /**
     * dropdown editable numeric list
     */
    static NUMBER_EDITABLE_LIST_TYPE = 'numberEditableList';

    /**
     * dropdown editable numeric list
     */
    static EDITABLE_TABLE_TYPE = 'editableTable';

    /**
     * time filter input field
     */
    static TIME_FILTER_TYPE = 'timeFilter';

    /**
     * propTypes
     * @property {string} label field's label to show above the field
     * @property {string} name name of the input field
     * @property {string} [placeholder=''] specifies a short hint that describes the expected value of an input field
     * @property {string} [type=GenericField.STRING_TYPE] specifies type of the field
     * @property {string} [icon=null] additional icon in right side of the input field
     * @property {string} [description=''] fields description showed in popup when user hovers field
     * @property {object} [value=''] specifies the value of an <input> element
     * @property {object[]} [items=[]] list of items (for list types) or list of columns (for {@link GenericField.EDITABLE_TABLE_TYPE} type)
     * @property {function} [onChange=()=>{}] function called on input value change
     * @property {number} [max=null] maximal value (for {@link GenericField.NUMBER_TYPE} type) or number of rows (for {@link GenericField.EDITABLE_TABLE_TYPE})
     * @property {number} [min=null] minimal value (only for {@link GenericField.NUMBER_TYPE} type)
     */
    static propTypes = {
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        type: PropTypes.string,
        icon: PropTypes.string,
        description: PropTypes.string,
        value: PropTypes.any,
        items: PropTypes.array,
        onChange: PropTypes.func,
        max: PropTypes.number,
        min: PropTypes.number
    };

    static defaultProps = {
        placeholder: '',
        type: GenericField.STRING_TYPE,
        icon: null,
        description: '',
        value: '',
        items: [],
        onChange: ()=>{},
        max: null,
        min: null
    };

    constructor(props,context) {
        super(props,context);

        this._initOptions(props);
    }

    _initOptions(props) {
        if (!_.isEmpty(props.items)) {
            let valueAlreadyInOptions = false;
            let options = _.map(props.items, item => {
                if (!_.isObject(item)) {
                    item = {name:item, value:item};
                }

                if (item.value === props.value) {
                    valueAlreadyInOptions = true;
                }
                return { text: item.name, value: item.value}
            });

            if (props.type !== GenericField.MULTI_SELECT_LIST_TYPE && !valueAlreadyInOptions) {
                options.push({ text: props.value, value: props.value });
            }

            this.state = {options};
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props && nextProps.items !== this.props.items) {
            this._initOptions(nextProps);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(JSON.stringify(this.props), JSON.stringify(nextProps))
            || !_.isEqual(JSON.stringify(this.state), JSON.stringify(nextState));
    }

    static formatValue(type, value) {
        if (type === GenericField.MULTI_SELECT_LIST_TYPE) {
            value = _.split(value, ',');
        } else if (type === GenericField.BOOLEAN_TYPE) {
            value = (_.isBoolean(value) && value) || (_.isString(value) && value === 'true');
        } else if (type === GenericField.NUMBER_TYPE ||
                   type === GenericField.NUMBER_LIST_TYPE ||
                   type === GenericField.NUMBER_EDITABLE_LIST_TYPE) {
            value = parseInt(value) || 0;
        }

        return value;
    }

    render() {
        var field;

        if (this.props.type === GenericField.STRING_TYPE ||
            this.props.type === GenericField.NUMBER_TYPE ||
            this.props.type === GenericField.PASSWORD_TYPE) {

            field = <Input icon={this.props.icon} iconPosition={this.props.icon?'left':undefined} name={this.props.name}
                           type={this.props.type === GenericField.STRING_TYPE?'text':this.props.type}
                           placeholder={this.props.placeholder} value={this.props.value === null ? '' : this.props.value}
                           onChange={(proxy, field)=>this.props.onChange(proxy, Object.assign({}, field, {genericType: this.props.type}))}
                           max={this.props.type === GenericField.NUMBER_TYPE?this.props.max:null}
                           min={this.props.type === GenericField.NUMBER_TYPE?this.props.min:null}/>;

        } else if (this.props.type === GenericField.BOOLEAN_TYPE) {

            field = <Checkbox name={this.props.name} toggle={true}
                              checked={(_.isBoolean(this.props.value) && this.props.value) ||
                                       (_.isString(this.props.value) && this.props.value === 'true')}
                              onChange={(proxy, field)=>this.props.onChange(proxy, Object.assign({}, field, {genericType: this.props.type}))}/>

        } else if (this.props.type === GenericField.LIST_TYPE ||
                   this.props.type === GenericField.NUMBER_LIST_TYPE ||
                   this.props.type === GenericField.MULTI_SELECT_LIST_TYPE ||
                   this.props.type === GenericField.EDITABLE_LIST_TYPE ||
                   this.props.type === GenericField.NUMBER_EDITABLE_LIST_TYPE) {

            field = <Dropdown fluid selection value={this.props.value} name={this.props.name}
                              multiple={this.props.type === GenericField.MULTI_SELECT_LIST_TYPE}
                              allowAdditions={this.props.type === GenericField.EDITABLE_LIST_TYPE ||
                                              this.props.type === GenericField.NUMBER_EDITABLE_LIST_TYPE}
                              search={this.props.type === GenericField.EDITABLE_LIST_TYPE ||
                                      this.props.type === GenericField.NUMBER_EDITABLE_LIST_TYPE}
                              placeholder={this.props.placeholder} options={this.state.options}
                              onAddItem={(e, { value }) => {this.setState({options: [{ text: value, value }, ...this.state.options]})}}
                              onChange={(proxy, field)=> { this.props.onChange(proxy, Object.assign({}, field, {genericType: this.props.type}))}} />;

        } else if (this.props.type === GenericField.EDITABLE_TABLE_TYPE) {

            field = <EdiTable name={this.props.name}
                              value={this.props.value}
                              rows={this.props.max}
                              columns={this.props.items}
                              onChange={(proxy, field)=>this.props.onChange(proxy, Object.assign({}, field, {genericType: this.props.type}))} />;
        } else if (this.props.type === GenericField.TIME_FILTER_TYPE) {

            field = <InputTimeFilter name={this.props.name}
                                     placeholder={this.props.placeholder}
                                     defaultValue={InputTimeFilter.INFLUX_DEFAULT_VALUE}
                                     value={this.props.value}
                                     onApply={(proxy, field)=>this.props.onChange(proxy, Object.assign({}, field, {genericType: this.props.type}))} />;
        }

        return (
            <Form.Field className={this.props.name}>
                {
                    this.props.label &&
                    <label>{this.props.label}&nbsp;
                        {
                            this.props.description &&
                            <Popup>
                                <Popup.Trigger><Icon name="help circle outline"/></Popup.Trigger>
                                {this.props.description}
                            </Popup>
                        }
                    </label>
                }

                {field}

            </Form.Field>
        );
    }
}