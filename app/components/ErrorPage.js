/**
 * Created by pposel on 8/17/17.
 */

import React, { Component } from 'react';
import { Link } from 'react-router';
import {Message} from 'semantic-ui-react';

export default class ErrorPage extends Component {

    render () {
        return (
            <div className='coloredContainer'>
                <div className="ui raised very padded text container segment center aligned segment404">
                    <h2 className="ui header">Unexpected error occurred</h2>
                    <Message content={this.props.error} error/>
                    <Link to={{pathname: '/login', search: this.props.location.search}}>Go back to login</Link>
                </div>
            </div>
        );
    }
}
