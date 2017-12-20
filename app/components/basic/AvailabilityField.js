/**
 * Created by pposel on 08/05/2017.
 */

import React, { Component, PropTypes } from 'react';
import AvailabilityIcon from '../AvailabilityIcon';
import consts from '../../utils/consts';

/**
 * AvailabilityField - allowing the user to choose availabilities for resources by showing the availability icon and clicking on it to switch.
 *
 * The component accepts a callback function to be called with the current availability on change.
 *
 * ## Access
 * `Stage.Basic.AvailabilityField`
 *
 * ## Usage
 *
 */
export default class AvailabilityField extends Component {

    /**
     * order of availabilities when changing availability
     */
    static availabilitiesOrder = [consts.availability.TENANT, consts.availability.PRIVATE, consts.availability.GLOBAL];


    /**
     * @property {string} [availability] the current availability, one from ['tenant', 'private', 'global'].
     * @property {function} [onAvailabilityChange=()=>{}] the callback to be called with the new availability
     * @property {bool} [disallowGlobal=false] should the component not allow changing the global
     * @property {string} [className=''] Name of the style class to be added
     */
    static propTypes = {
        availability: PropTypes.oneOf([
            consts.availability.PRIVATE,
            consts.availability.TENANT,
            consts.availability.GLOBAL]).isRequired,
        onAvailabilityChange: PropTypes.func,
        disallowGlobal: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        onAvailabilityChange: () => {},
        disallowGlobal: false,
        className: ''
    };

    onClick(){
        let availabilities = this.props.disallowGlobal? _.dropRight(AvailabilityField.availabilitiesOrder) : AvailabilityField.availabilitiesOrder;
        let index = availabilities.indexOf(this.props.availability);
        if(index >= 0 && index < availabilities.length - 1) {
            this.props.onAvailabilityChange(availabilities[index + 1]);
        } else{
            this.props.onAvailabilityChange(availabilities[0]);
        }
    }

    render() {
        return (
            <AvailabilityIcon availability={this.props.availability} link className={this.props.className} onClick={this.onClick.bind(this)} />
        );
    }
}

