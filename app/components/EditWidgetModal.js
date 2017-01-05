/**
 * Created by addihorowitz on 11/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class EditWidgetModal extends Component {

    static propTypes = {
        configuration: PropTypes.object.isRequired,
        configDef: PropTypes.array.isRequired,
        widget: PropTypes.object.isRequired,
        onWidgetEdited: PropTypes.func.isRequired
    };

    _editWidget() {
        // Get the changed configurations
        var config = _.clone(this.props.configuration);
        $(this.refs.modal).find('.configInput').each((index,input)=>{
            var $input = $(input);
            var id = $input.data('id');
            var value = $input.val();

            config[id] = value;
        });

        if (config) {
            this.props.onWidgetEdited(config);
        }

        $('#editWidgetModal-'+this.props.widget.id).modal('hide');
    }

    render() {
        return (
            <div className="ui large modal" ref='modal' id={'editWidgetModal-'+this.props.widget.id}>
              <div className="header">
                Configure Widget
              </div>

              <div className="content">
                  <div className="ui form">
                    {
                        this.props.configDef.map((config)=>{
                            var currValue = _.get(this.props.config,'[config.id]',config.value || config.default);

                            return (
                                <div className="field" key={config.id}>
                                    <label>{config.name}</label>
                                    <div className="ui icon input fluid mini">
                                        {
                                            config.icon ?
                                                <i className={config.icon + " icon"}></i>
                                                :
                                                ''
                                        }
                                        <input className='configInput' data-id={config.id} type="text" placeholder={config.placeHolder} defaultValue={currValue}/>
                                    </div>
                                </div>
                            );
                        })
                    }
                  </div>
            </div>
            <div className="actions">
                <button className="ui approve button" onClick={this._editWidget.bind(this)}>Save</button>
                <button className="ui cancel button">Cancel</button>
            </div>
        </div>
        );
    }
}
