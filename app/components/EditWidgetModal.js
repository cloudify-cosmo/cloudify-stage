/**
 * Created by addihorowitz on 11/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class EditWidgetModal extends Component {

    static propTypes = {
        configuration: PropTypes.array.isRequired,
        widget: PropTypes.object.isRequired,
        onWidgetEdited: PropTypes.func.isRequired
    };

    _editWidget() {
        // Get the changed configurations
        var config = this.props.configuration;
        $(this.refs.modal).find('.configInput').each((index,input)=>{
            var $input = $(input);
            var id = $input.data('id');
            var value = $input.val();

            config = config.map((conf)=>{
                if (conf.id === id) {
                    return Object.assign({},conf,{value:value});
                }
                return conf;
            });
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
                <div className="ui segment basic large">
                    {
                        this.props.configuration.map((config)=>{
                            return (
                                <div key={config.id}>
                                    <h4> {config.name} </h4>
                                    <div className="ui icon input fluid mini">
                                        {
                                            config.icon ?
                                                <i className={config.icon + " icon"}></i>
                                                :
                                                ''
                                        }
                                        <input className='configInput' data-id={config.id} type="text" placeholder={config.placeHolder} defaultValue={config.value || config.default}/>
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
