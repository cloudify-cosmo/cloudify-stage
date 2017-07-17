/**
 * Created by pposel on 08/05/2017.
 */

import React, { Component, PropTypes } from 'react';
import {Icon} from 'semantic-ui-react'

/**
 * PrivateField - a simple component showing a locked/unlocked icon depending on its state
 *
 * The component accepts a callback function for onClick event making it possible to change
 * the component's state by user interaction.
 *
 * ## Access
 * `Stage.Basic.PrivateField`
 *
 * ## Usage
 *
 * ### PrivateField (locked)
 *
 * ![PrivateField](manual/asset/privateField/PrivateField_0.png)
 * ```
 * <PrivateField title='Private Field Locked' lock={true} />
 *```
 * ### PrivateField (unlocked)
 *
 * ![PrivateField](manual/asset/privateField/PrivateField_1.png)
 * ```
 * <PrivateField title='Private Field Unlocked' />
 *```
 */
export default class PrivateField extends Component {

    /**
     * @property {boolean} [lock='false'] If 'true' the icon will change to a red padlock (locked).
     * When 'false' the icon shows a black padlock (open)
     * @property {function} [onClick=()=>{}] The function that will be called when clicked
     * @property {string} [title=''] Tooltip text when mouse is over the component
     * @property {string} [className=''] Name of the style class to be added
     */
    static propTypes = {
        lock: PropTypes.bool,
        onClick: PropTypes.func,
        title: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        lock: false,
        onClick: () => {},
        title: '',
        className: ''
    };

    render() {
        return (
            <Icon name={this.props.lock?'lock':'unlock'} link className={this.props.className}
                  color={this.props.lock?'red':'black'} title={this.props.title}
                  onClick={this.props.onClick}/>
        );
    }
}

