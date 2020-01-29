/**
 * Created by kinneretzin on 15/11/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Input } from 'semantic-ui-react';
import { Checkbox, Dropdown, Form } from 'cloudify-ui-components';

/**
 * GenericField is a generic component which can be used as different input fields in {@link Form} component
 *
 * It is used widely in widget configuration modal. Constant values used for defining field type are described below.
 *
 * ## Access
 * `Stage.Basic.GenericField`
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
 * ### Custom filed - Time filter
 * ![GenericField](manual/asset/form/GenericField_11.png)
 * ```
 * <GenericField name="timeFilterTest" type={GenericField.CUSTOM_TYPE} component={Stage.Basic.TimeFilter}
 *               label="TIME_FILTER_TYPE" value={Stage.Basic.TimeFilter.DEFAULT_VALUE} />
 * ```
 */

export default class GenericField extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = GenericField.isListType(props.type) ? { options: [] } : {};
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        this.initOptions(this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(JSON.stringify(this.props), JSON.stringify(nextProps)) ||
            !_.isEqual(JSON.stringify(this.state), JSON.stringify(nextState))
        );
    }

    componentDidUpdate(prevProps) {
        const { items } = this.props;
        if (items !== prevProps.items) {
            this.initOptions(this.props);
        }
    }

    initOptions(props) {
        if (props.type === GenericField.BOOLEAN_LIST_TYPE) {
            this.setState({
                options: [{ text: 'false', value: false }, { text: 'true', value: true }]
            });
        } else if (GenericField.isListType(props.type) && props.items) {
            let valueAlreadyInOptions = false;
            const options = _.map(props.items, item => {
                if (!_.isObject(item)) {
                    item = { name: item, value: item };
                }

                if (item.value === props.value) {
                    valueAlreadyInOptions = true;
                }
                return { text: item.name, value: item.value };
            });

            if (props.type !== GenericField.MULTI_SELECT_LIST_TYPE && !valueAlreadyInOptions) {
                options.push({ text: props.value, value: props.value });
            }

            this.setState({ options });
        }
    }

    handleInputChange(proxy, field) {
        const { onChange, type } = this.props;
        onChange(proxy, { ...field, genericType: type });
    }

    render() {
        const {
            component,
            default: defaultValue,
            description,
            error,
            icon,
            label,
            max,
            min,
            name,
            placeholder,
            required,
            type,
            value
        } = this.props;
        const { options } = this.state;
        let field = null;

        if (
            type === GenericField.STRING_TYPE ||
            type === GenericField.NUMBER_TYPE ||
            type === GenericField.PASSWORD_TYPE
        ) {
            field = (
                <Input
                    icon={icon}
                    name={name}
                    type={type === GenericField.STRING_TYPE ? 'text' : type}
                    placeholder={placeholder}
                    value={value === null ? '' : value}
                    onChange={this.handleInputChange}
                    max={type === GenericField.NUMBER_TYPE ? max : null}
                    min={type === GenericField.NUMBER_TYPE ? min : null}
                />
            );
        } else if (type === GenericField.BOOLEAN_TYPE) {
            field = (
                <Checkbox
                    label=" "
                    name={name}
                    toggle
                    checked={(_.isBoolean(value) && value) || (_.isString(value) && value === 'true')}
                    onChange={this.handleInputChange}
                />
            );
        } else if (GenericField.isListType(type)) {
            field = (
                <Dropdown
                    fluid
                    selection
                    value={value}
                    name={name}
                    multiple={type === GenericField.MULTI_SELECT_LIST_TYPE}
                    allowAdditions={
                        type === GenericField.EDITABLE_LIST_TYPE || type === GenericField.NUMBER_EDITABLE_LIST_TYPE
                    }
                    search={type === GenericField.EDITABLE_LIST_TYPE || type === GenericField.NUMBER_EDITABLE_LIST_TYPE}
                    placeholder={placeholder || 'Please select'}
                    options={options}
                    onAddItem={(e, { value: newValue }) => {
                        this.setState({ options: [{ text: newValue, value: newValue }, ...options] });
                    }}
                    onChange={this.handleInputChange}
                    clearable={false}
                />
            );
        } else if (type === GenericField.CUSTOM_TYPE) {
            const optionalProps = _.keys(GenericField.defaultProps);
            const requiredProps = ['name', 'label', 'component'];
            const componentProps = _.omit(this.props, [...optionalProps, ...requiredProps]);

            if (_.isUndefined(component)) {
                return new Error(`For \`${type}\` type \`component\` prop have to be supplied.`);
            }

            field = (
                <component
                    name={name}
                    value={_.isUndefined(value) ? defaultValue : value}
                    onChange={this.handleInputChange}
                    /* eslint-disable-next-line react/jsx-props-no-spreading */
                    {...componentProps}
                />
            );
        }

        return (
            <Form.Field className={name} help={description} label={label} required={required} error={error}>
                {field}
            </Form.Field>
        );
    }
}

/**
 * alphanumeric input field
 */
GenericField.STRING_TYPE = 'string';

/**
 * password input field
 */
GenericField.PASSWORD_TYPE = 'password';

/**
 * numeric input field
 */
GenericField.NUMBER_TYPE = 'number';

/**
 * two-state input field
 */
GenericField.BOOLEAN_TYPE = 'boolean';

/**
 * boolean with no default
 */
GenericField.BOOLEAN_LIST_TYPE = 'booleanList';

/**
 * dropdown alphanumeric list field
 */
GenericField.LIST_TYPE = 'list';

/**
 * dropdown numeric list field
 */
GenericField.NUMBER_LIST_TYPE = 'numberList';

/**
 * dropdown multiselection list
 */
GenericField.MULTI_SELECT_LIST_TYPE = 'multiSelectList';

/**
 * dropdown editable list
 */
GenericField.EDITABLE_LIST_TYPE = 'editableList';

/**
 * dropdown editable numeric list
 */
GenericField.NUMBER_EDITABLE_LIST_TYPE = 'numberEditableList';

/**
 * custom input field
 */
GenericField.CUSTOM_TYPE = 'custom';

GenericField.formatValue = (type, value) => {
    let formattedValue = null;

    if (type === GenericField.MULTI_SELECT_LIST_TYPE) {
        formattedValue = _.split(value, ',');
    } else if (type === GenericField.BOOLEAN_TYPE) {
        formattedValue = (_.isBoolean(value) && value) || (_.isString(value) && value === 'true');
    } else if (
        type === GenericField.NUMBER_TYPE ||
        type === GenericField.NUMBER_LIST_TYPE ||
        type === GenericField.NUMBER_EDITABLE_LIST_TYPE
    ) {
        formattedValue = parseInt(value, 10) || 0;
    }

    return formattedValue;
};

GenericField.isListType = type => {
    return (
        type === GenericField.LIST_TYPE ||
        type === GenericField.NUMBER_LIST_TYPE ||
        type === GenericField.MULTI_SELECT_LIST_TYPE ||
        type === GenericField.BOOLEAN_LIST_TYPE ||
        type === GenericField.EDITABLE_LIST_TYPE ||
        type === GenericField.NUMBER_EDITABLE_LIST_TYPE
    );
};

GenericField.propTypes = {
    /**
     * field's label to show above the field
     */
    label: PropTypes.string.isRequired,

    /**
     * name of the input field
     */
    name: PropTypes.string.isRequired,

    /**
     *
     */
    component: PropTypes.node,

    /**
     * default value of the field
     */
    // eslint-disable-next-line react/forbid-prop-types
    default: PropTypes.any,

    /**
     * fields description showed in popup when user hovers field
     */
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    /**
     * specifies if a field should be marked as field with error
     */
    error: PropTypes.bool,

    /**
     * additional icon in right side of the input field
     */
    icon: PropTypes.string,

    /**
     * list of items (for list types)
     */
    // eslint-disable-next-line react/forbid-prop-types
    items: PropTypes.array,

    /**
     * maximal value (only for GenericField.NUMBER_TYPE types)
     */
    max: PropTypes.number,

    /**
     * minimal value (only for GenericField.NUMBER_TYPE types)
     */
    min: PropTypes.number,

    /**
     * function called on input value change
     */
    onChange: PropTypes.func,

    /**
     * specifies a short hint that describes the expected value of an input field
     */
    placeholder: PropTypes.string,

    /**
     * define if a field is required adding a red star icon to label
     */
    required: PropTypes.bool,

    /**
     * specifies type of the field
     */
    type: PropTypes.string,

    /**
     * specifies the value of the field
     */
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.any
};

GenericField.defaultProps = {
    component: null,
    default: '',
    description: '',
    error: false,
    icon: null,
    items: [],
    max: null,
    min: null,
    onChange: () => {},
    placeholder: '',
    required: false,
    type: GenericField.STRING_TYPE,
    value: ''
};
