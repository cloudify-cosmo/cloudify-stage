/**
 * Created by kinneretzin on 29/08/2016.
 */

import React, { Component } from 'react';

export default class MaintenanceModePageMessage extends Component {

    render () {
        var {Label} = Stage.Basic;
        return (
            <div className='coloredContainer'>

                <div className="ui raised very padded text container segment center aligned segment404">

                    <h2 className="ui header"><Label horizontal size="massive" color="blue">Maintenance mode</Label></h2>
                    <p>Server is on maintenance mode and is not available at the moment.</p>
                </div>

            </div>
        );
    }
}
