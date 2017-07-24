/**
 * Created by pawelposel on 2016-11-18.
 */

import React, { Component, PropTypes } from 'react';
import { Icon } from 'semantic-ui-react'

/**
 * Checkmark component shows a simple checkbox (read only)
 *
 * ## Access
 * `Stage.Basic.Checkmark`
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
     * @property {boolean} value If true the component will be marked as checked
     */
    static propTypes = {
        value: PropTypes.bool
    };

    static defaultProps = {
    };

    render() {
        return (
            <Icon title={this.props.value ? 'Yes' : 'No'} name={this.props.value ? 'checkmark box' : 'square outline'}/>
        );
    }
}
