/**
 * Created by addihorowitz on 11/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class EditWidgetModal extends Component {

    static propTypes = {
        configuration: PropTypes.object.isRequired,
        widgetId: PropTypes.string.isRequired,
        onWidgetEdited: PropTypes.func.isRequired
    };

    editWidget(widget, configuration) {
        this.props.onWidgetEdited(widget, configuration);
        $('#editWidgetModal-'+widget.id).modal('hide');
    }

    render() {
        return (
            <div className="ui large modal" id={"editWidgetModal-"+this.props.widgetId}>
              <div className="header">
                Configure Widget
              </div>

              <div className="content">
                <div className="ui segment basic large">
                    <div className="ui icon input fluid mini">
                        <i className="search icon"></i>
                        <input type="text" name="filterBy" placeholder="Filter by name ..." defaultValue={this.props.configuration.filterBy}/>
                    </div>
                    <div className="ui divider"></div>
                    {
                        this.props.configuration ?
                            <div>
                            <div className="ui icon input fluid mini">
                                <input type="text" name="fetchUsername" placeholder="Fetch with username ..." defaultValue={this.props.configuration.fetchUsername}/>
                            </div>
                            <div className="ui divider"/>
                            </div>
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
                <button className="ui approve button" onClick={this.editWidget.bind(this,widget)}>Save</button>
                <button className="ui cancel button">Cancel</button>
            </div>
        </div>
        );
    }
}
