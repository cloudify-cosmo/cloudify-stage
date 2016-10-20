/**
 * Created by addihorowitz on 11/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class EditWidgetModal extends Component {

    static propTypes = {
        configuration: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        onWidgetEdited: PropTypes.func.isRequired
    };

    _editWidget() {
        let fetchUsername = document.getElementById('fetchUsername').value;
        if (fetchUsername != this.props.configuration.fetchUsername)
        {
            //this.props.widget.configuration.fetchUsername = fetchUsername;
            var configuration = $.extend(true, {}, this.props.configuration);
            configuration.fetchUsername.value = fetchUsername;
            this.props.onWidgetEdited(configuration);
        }
        $('#editWidgetModal-'+this.props.widget.id).modal('hide');
    }

    render() {
    var formattedData = [];
    this.props.widget.configuration ?
        formattedData = $.map(this.props.widget.configuration, function(value, key) {
            return [{key: key, placeHolder: value.placeHolder, icon: value.icon, default: value.default, value: value.value, title: value.title}];
        })
        :
        ''
        return (
            <div className="ui large modal" id={"editWidgetModal-"+this.props.widget.id}>
              <div className="header">
                Configure Widget
              </div>

              <div className="content">
                <div className="ui segment basic large">
                    {
                        formattedData ?
                            formattedData.map((item)=>{
                                return (
                                <div>
                                <h4> {item.title} </h4>
                                <div className="ui icon input fluid mini">
                                    {
                                        item.icon ?
                                            <i className={item.icon + " icon"}></i>
                                            :
                                            ''
                                    }
                                    <input type="text" id={item.key} placeholder={item.placeHolder} defaultValue={item.value || item.default}/>
                                </div>
                                <div className="ui divider"/>
                                </div>
                                );
                            })
                        :
                        ''
                    }
                    <div className="ui floating labeled icon dropdown button" ref={select=>$(select).dropdown()}>
                      <i className="filter icon"></i>
                      <span className="text">Filter by Status</span>
                      <div className="menu">
                        <div className="item">
                          <i className="circular inverted green thumbs up outline icon"></i>
                          Up
                        </div>
                        <div className="item">
                          <i className="circular inverted red thumbs down outline icon"></i>
                          Down
                        </div>
                        <div className="item">
                          <i className="circular inverted orange hourglass half icon"></i>
                          Warning
                        </div>
                      </div>
                    </div>
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
