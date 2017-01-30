/**
 * Created by jakubniezgoda on 11/01/2017.
 */

import React, { Component, PropTypes } from 'react';

export default class TableRowExpandable extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        expanded: PropTypes.bool
    };

    static defaultProps = {
        expanded: false
    };

    render() {
        return ({});
    }
}
