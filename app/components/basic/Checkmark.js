/**
 * Created by pawelposel on 2016-11-18.
 */

import React, { Component, PropTypes } from 'react';
import { Checkbox } from 'semantic-ui-react'

/**
 * Checkmark component shows a simple checkbox (read only)
 *
 * ## Usage
 *
 * ### Checkmark (checked/unchecked)
 *
 * ![Checkmark](manual/asset/checkmark/Checkmark_0.png)
 * ```
 * <Checkmark value={true} />
 * <Checkmark value={false} />
 *```
 */
export default class Checkmark extends Component {

    /**
     * @property {boolean} value=true If true the component will be marked as checked
     */
    static propTypes = {
        value: PropTypes.bool.isRequired
    };

    static defaultProps = {
        value: false
    };

    render() {
        return (
            <Checkbox title={this.props.value ? 'Yes' : 'No'} checked={this.props.value} readOnly/>
        );
    }
}
