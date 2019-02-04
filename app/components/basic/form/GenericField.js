/**
 * Created by kinneretzin on 15/11/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {Input, Checkbox, Dropdown, Form} from '../index'
import {getToolbox} from '../../../utils/Toolbox';

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
 * ### Custom field - Editable table
 * ![GenericField](manual/asset/form/GenericField_10.png)
 * ```
 * <GenericField name="editableTable" type={GenericField.CUSTOM_TYPE} component={Stage.Basic.Form.Table}
 *               label="EDITABLE_TABLE_TYPE"
 *               columns={[
 *                 {name: "metric", label: 'Metric', default: "", type: Stage.Basic.GenericField.EDITABLE_LIST_TYPE, description: "Name of the metric to be presented on the graph",
 *                  items: ["", "cpu_total_system", "cpu_total_user", "memory_MemFree", "memory_SwapFree", "loadavg_processes_running"]},
 *                 {name: 'label', label: 'Label', default: "", type: Stage.Basic.GenericField.STRING_TYPE, description: "Chart label"},
 *                 {name: 'unit', label: 'Unit', default: "", type: Stage.Basic.GenericField.STRING_TYPE, description: "Chart data unit"}
 *               ]}
 *               rows={3} />
 * ```
 *
 * ### Custom filed - Time filter
 * ![GenericField](manual/asset/form/GenericField_11.png)
 * ```
 * <GenericField name="timeFilterTest" type={GenericField.CUSTOM_TYPE} component={Stage.Basic.TimeFilter}
 *               label="TIME_FILTER_TYPE" value={Stage.Basic.TimeFilter.INFLUX_DEFAULT_VALUE} />
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
     * boolean with no default
     */
    static BOOLEAN_LIST_TYPE = 'booleanList';

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
     * custom input field
     */
    static CUSTOM_TYPE = 'custom';

    static isListType(type) {
        return type === GenericField.LIST_TYPE ||
               type === GenericField.NUMBER_LIST_TYPE ||
               type === GenericField.MULTI_SELECT_LIST_TYPE ||
               type === GenericField.BOOLEAN_LIST_TYPE ||
               type === GenericField.EDITABLE_LIST_TYPE ||
               type === GenericField.NUMBER_EDITABLE_LIST_TYPE;
    }

    /**
     * propTypes
     * @property {string} label field's label to show above the field
     * @property {string} name name of the input field
     * @property {string} [placeholder=''] specifies a short hint that describes the expected value of an input field
     * @property {string} [error=false] specifies if a field should be marked as field with error
     * @property {string} [type=GenericField.STRING_TYPE] specifies type of the field
     * @property {string} [icon=null] additional icon in right side of the input field
     * @property {string} [description=''] fields description showed in popup when user hovers field
     * @property {object} [value=''] specifies the value of an <input> element
     * @property {boolean} [required={true}] define if a field is required adding a red star icon to label
     * @property {object[]} [items=[]] list of items (for list types)
     * @property {function} [onChange=()=>{}] function called on input value change
     * @property {number} [max=null] maximal value (only for {@link GenericField.NUMBER_TYPE} type)
     * @property {number} [min=null] minimal value (only for {@link GenericField.NUMBER_TYPE} type)
     */
    static propTypes = {
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        error: PropTypes.bool,
        type: PropTypes.string,
        icon: PropTypes.string,
        description: PropTypes.string,
        value: PropTypes.any,
        required: PropTypes.bool,
        onChange: PropTypes.func,
        storeValueInContext: PropTypes.bool,

        // field specific configuration
        items: PropTypes.array,
        max: PropTypes.number,
        min: PropTypes.number
    };

    static defaultProps = {
        placeholder: '',
        error: false,
        type: GenericField.STRING_TYPE,
        icon: null,
        description: '',
        value: '',
        onChange: ()=>{},
        storeValueInContext: false,

        // field specific configuration
        items: [],
        max: null,
        min: null
    };

    constructor(props,context) {
        super(props,context);

        this.toolbox = getToolbox(()=>{}, ()=>{}, null);
        this.state = GenericField.isListType(props.type)
        ? {options: []}
        : {};
    }

    _initOptions(props) {
        if(props.type === GenericField.BOOLEAN_LIST_TYPE){
            this.setState({
                options: [{text: 'false', value: false}, {text: 'true', value: true}]
            });
        } else if (GenericField.isListType(props.type) && props.items) {
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

            this.setState({options});
        }
    }

    _storeValueInContext(name, value) {
        this.toolbox.getContext().setValue([name], value);
        this.toolbox.getEventBus().trigger(`${name}:change`);
    }

    _handleInputChange(proxy, field) {
        if (this.props.storeValueInContext) {
            this._storeValueInContext(field.name, field.value);
        }
        this.props.onChange(proxy, Object.assign({}, field, {genericType: this.props.type}));
    }

    componentDidMount() {
        if (this.props.storeValueInContext) {
            this._storeValueInContext(this.props.name, this.props.value);
        }
        this._initOptions(this.props);
    }

    componentDidUpdate(prevProps) {
        if (this.props.items !== prevProps.items) {
            this._initOptions(this.props);
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

            field = <Input icon={this.props.icon} name={this.props.name}
                           type={this.props.type === GenericField.STRING_TYPE?'text':this.props.type}
                           placeholder={this.props.placeholder} value={this.props.value === null ? '' : this.props.value}
                           onChange={this._handleInputChange.bind(this)}
                           max={this.props.type === GenericField.NUMBER_TYPE?this.props.max:null}
                           min={this.props.type === GenericField.NUMBER_TYPE?this.props.min:null}/>;

        } else if (this.props.type === GenericField.BOOLEAN_TYPE) {

            field = <Checkbox name={this.props.name} toggle={true}
                              checked={(_.isBoolean(this.props.value) && this.props.value) ||
                                       (_.isString(this.props.value) && this.props.value === 'true')}
                              onChange={this._handleInputChange.bind(this)}/>

        } else if (GenericField.isListType(this.props.type)) {

            field = <Dropdown fluid selection value={this.props.value} name={this.props.name}
                              multiple={this.props.type === GenericField.MULTI_SELECT_LIST_TYPE}
                              allowAdditions={this.props.type === GenericField.EDITABLE_LIST_TYPE ||
                              this.props.type === GenericField.NUMBER_EDITABLE_LIST_TYPE}
                              search={this.props.type === GenericField.EDITABLE_LIST_TYPE ||
                              this.props.type === GenericField.NUMBER_EDITABLE_LIST_TYPE}
                              placeholder={this.props.placeholder || 'Please select'} options={this.state.options}
                              onAddItem={(e, { value }) => {this.setState({options: [{ text: value, value }, ...this.state.options]})}}
                              onChange={this._handleInputChange.bind(this)} clearable={false} />;

        } else if (this.props.type === GenericField.CUSTOM_TYPE) {
            let optionalProps = _.keys(GenericField.defaultProps);
            let requiredProps = ['name', 'label', 'component'];
            let componentProps = _.omit(this.props, [...optionalProps, ...requiredProps]);
            let CustomComponent = this.props.component;

            if (_.isUndefined(CustomComponent)) {
                return new Error('For `' + this.props.type + '` type `component` prop have to be supplied.')
            }

            field = <CustomComponent name={this.props.name}
                                     value={_.isUndefined(this.props.value) ? this.props.default : this.props.value}
                                     onChange={this._handleInputChange.bind(this)}
                                     {...componentProps} />;
        }

        return (
            <Form.Field className={this.props.name}
                        help={this.props.description}
                        label={this.props.label}
                        required={this.props.required}
                        error={this.props.error}>
                {field}
            </Form.Field>
        );
    }
}