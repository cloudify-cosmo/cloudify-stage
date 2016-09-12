/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component } from 'react';

export default class EditWidgetIcon extends Component {
    render() {
        return (
            <i className="setting link icon small editWidgetIcon"
               ref={(icon)=> {
                      if (icon != null) {
                            $(icon).click(()=>{
                                $('.editWidgetModal.modal').modal('show');
                            });
                      }
                  }}
            />
        );
    }
}
