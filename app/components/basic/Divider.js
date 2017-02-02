/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Divider } from 'semantic-ui-react'

export default class DividerWrapper extends Component {

    static propTypes = {
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        clearing: PropTypes.bool, //Divider can clear the content above it.
        fitted: PropTypes.bool, //Divider can be fitted without any space above or below it.
        hidden: PropTypes.bool, //Divider can divide content without creating a dividing line.
        horizontal: PropTypes.bool, //Divider can segment content horizontally.
        inverted: PropTypes.bool, //Divider can have it's colours inverted.
        section: PropTypes.bool, //Divider can provide greater margins to divide sections of content.
        vertical: PropTypes.bool, //Divider can segment content vertically.
    };

    render() {
        return (
            <Divider {...this.props}/>
        );
    }
}
