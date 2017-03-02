/**
 * Created by kinneretzin on 29/08/2016.
 */

import React, { Component } from 'react';
import { Link } from 'react-router';

export default class NotFound extends Component {

    render () {
        var {Message, Label} = Stage.Basic;

        return (
            <div className='coloredContainer'>

                <div className="ui raised very padded text container segment center aligned segment404">
                    <h2 className="ui header"><Label horizontal size="massive" color="blue">404</Label> Page Not Found</h2>
                    <p>We are sorry, but the page you are looking for doesn't exist.</p>
                    <p></p>
                    <Link to='/'>Go to the Homepage</Link>
                </div>

            </div>
        );
    }
}
