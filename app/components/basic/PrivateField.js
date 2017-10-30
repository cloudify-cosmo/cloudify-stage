/**
 * Created by pposel on 08/05/2017.
 */

import React, { Component, PropTypes } from 'react';
import {Icon} from 'semantic-ui-react';
import Popup from './Popup';

/**
 * PrivateField - a simple component showing a lock/user icon depending on resource availability.
 * Additional popup message is shown when user hover this component.
 *
 * The component accepts a callback function for onClick event making it possible to change
 * the component's state by user interaction.
 *
 * ## Access
 * `Stage.Basic.PrivateField`
 *
 * ## Usage
 *
 * ### PrivateField (private resource)
 *
 * ![PrivateField](manual/asset/privateField/PrivateField_0.png)
 * ```
 * <PrivateField lock={true} />
 *```
 * ### PrivateField (tenant resource)
 *
 * ![PrivateField](manual/asset/privateField/PrivateField_1.png)
 * ```
 * <PrivateField />
 *```
 */
export default class PrivateField extends Component {

    /**
     * @property {boolean} [lock='false'] If 'true' the icon will change to a red padlock (locked).
     * When 'false' the icon shows green user icon
     * @property {function} [onClick=()=>{}] The function that will be called when clicked
     * @property {string} [className=''] Name of the style class to be added
     */
    static propTypes = {
        lock: PropTypes.bool,
        onClick: PropTypes.func,
        className: PropTypes.string
    };

    static defaultProps = {
        lock: false,
        onClick: () => {},
        className: ''
    };

    render() {
        return (
            <Popup>
                <Popup.Trigger>
                    <Icon name={this.props.lock?'lock':'user'} link className={this.props.className}
                          color={this.props.lock?'red':'green'} title={this.props.lock?'Private resource':'Tenant resource'}
                          onClick={this.props.onClick} />
                </Popup.Trigger>
                Resource availability modification is not possible when you set it to private
            </Popup>
        );
    }
}

