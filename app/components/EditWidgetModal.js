/**
 * Created by addihorowitz on 11/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class EditWidgetModal extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = EditWidgetModal.initialState(props);
    }

    static propTypes = {
        configuration: PropTypes.object.isRequired,
        configDef: PropTypes.array.isRequired,
        widget: PropTypes.object.isRequired,
        show: PropTypes.bool.isRequired,
        onWidgetEdited: PropTypes.func.isRequired,
        onHideConfig: PropTypes.func.isRequired
    };

    static initialState = (props) => {
        var fields = {};

        props.configDef.filter((config) => !config.hidden).map((config)=>{
            var currValue = _.get(props.configuration,'['+config.id+']',config.value || config.default);
            fields[config.id] = currValue;
        });

        return {fields};
    };

    componentWillReceiveProps(nextProps) {
        this.setState(EditWidgetModal.initialState(nextProps));
    }

    onApprove() {
        // Get the changed configurations
        var config = _.clone(this.props.configuration);

        _.forEach(this.state.fields, function(value, key) {
            config[key] = value;
        });

        if (config) {
            this.props.onWidgetEdited(config);
        }

        this.props.onHideConfig();
        return true;
    }

    onDeny() {
        this.props.onHideConfig();
        return true;
    }

    _handleInputChange(proxy, field) {
        var name = field.name;
        var value = Stage.Basic.GenericField.formatValue(field.genericType, field.value);

        this.setState({fields: Object.assign({}, this.state.fields, {[name]: value})});
    }

    render() {
        var {Modal, GenericField, Form,Message} = Stage.Basic;

        return (
            <Modal show={this.props.show} onDeny={this.onDeny.bind(this)} onApprove={this.onApprove.bind(this)}>

                <Modal.Header>Configure Widget</Modal.Header>

                <Modal.Body>
                    <Form>
                        {
                            this.props.configDef.filter((config) => !config.hidden).map((config)=>{
                                return <GenericField key={config.id}
                                              name={config.id}
                                              type={config.type}
                                              placeholder={config.placeHolder}
                                              label={config.name}
                                              description={config.description}
                                              icon={config.icon}
                                              items={config.items}
                                              value={this.state.fields[config.id]}
                                              onChange={this._handleInputChange.bind(this)}/>
                            })
                        }

                        {_.isEmpty(this.props.configDef) &&
                            <Message>No configuration available for this widget</Message>
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Approve/>
                    <Modal.Cancel/>
                </Modal.Footer>
            </Modal>
        );
    }
}
