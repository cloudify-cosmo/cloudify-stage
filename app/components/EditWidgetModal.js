/**
 * Created by addihorowitz on 11/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class EditWidgetModal extends Component {

    static propTypes = {
        configuration: PropTypes.object.isRequired,
        configDef: PropTypes.array.isRequired,
        widget: PropTypes.object.isRequired,
        show: PropTypes.bool.isRequired,
        onWidgetEdited: PropTypes.func.isRequired,
        onHideConfig: PropTypes.func.isRequired
    };

    onApprove() {
        // Get the changed configurations
        var config = _.clone(this.props.configuration);

        $(this.refs.configForm).find('.fieldInput').each((index,input)=>{
            var $input = $(input);
            var id = $input.data('id');
            var type = $input.data('type');
            var value = $input.val();

            if (type === Stage.Basic.Field.MULTI_SELECT_LIST_TYPE) {
                value = _.split(value, ',');
            } else if (type === Stage.Basic.Field.BOOLEAN_TYPE) {
                value = $input.is(':checked');
            }

            config[id] = value;
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

    render() {
        var Modal = Stage.Basic.Modal;
        var Field = Stage.Basic.Field;

        return (
            <Modal show={this.props.show} onDeny={this.onDeny.bind(this)}
                         onApprove={this.onApprove.bind(this)} onVisible={(modal)=>$(modal).find('[data-content]').popup()}>
                <Modal.Header>Configure Widget</Modal.Header>

                <Modal.Body>
                    <div className="ui form" ref='configForm'>
                    {
                        this.props.configDef.map((config)=>{
                            var currValue = _.get(this.props.configuration,'['+config.id+']',config.value || config.default);

                            return <Field key={config.id}
                                          id={config.id}
                                          type={config.type}
                                          placeholder={config.placeHolder}
                                          label={config.name}
                                          description={config.description}
                                          value={currValue}
                                          icon={config.icon}
                                          items={config.items}/>
                        })
                    }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Approve/>
                    <Modal.Cancel/>
                </Modal.Footer>
            </Modal>
        );
    }
}
