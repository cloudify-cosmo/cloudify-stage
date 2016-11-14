/**
 * Created by pawelposel on 12/11/2016.
 */
 
import React, { Component, PropTypes } from 'react';

export default class ErrorMessage extends Component {

    static propTypes = {
        error: PropTypes.string
    };

    render() {
        if (!this.props.error) {
            return null;
        }
        
        return <div className="ui error message" style={{"display":"block"}}>
                    <div className="header">Error Occured</div>
                    <p>{this.props.error}</p>
                </div>
    }
}
 