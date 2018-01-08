/**
 * Created by pposel on 08/05/2017.
 */

import React, { Component, PropTypes } from 'react';
import VisibilityIcon from '../VisibilityIcon';
import consts from '../../utils/consts';

/**
 * VisibilityField - allowing the user to choose visibilities for resources by showing the visibility icon and clicking on it to switch.
 *
 * The component accepts a callback function to be called with the current visibility on change.
 *
 * ## Access
 * `Stage.Basic.VisibilityField`
 *
 * ## Usage
 *  <VisibilityField visibility={CURRENT_AVAILABILITY} onVisibilityChange={(newVisibility) => IMPLEMENT_LOGIC_HERE} disallowGlobal={true} className={ANY_CLASS_NAME}/>
 */
export default class VisibilityField extends Component {

    /**
     * order of visibilities when changing visibility
     */
    static visibilitiesOrder = [consts.visibility.TENANT.name, consts.visibility.PRIVATE.name, consts.visibility.GLOBAL.name];


    /**
     * @property {string} [visibility] the current visibility, one from ['tenant', 'private', 'global'].
     * @property {function} [onVisibilityChange=()=>{}] the callback to be called with the new visibility
     * @property {bool} [disallowGlobal=false] should the component not allow changing the global
     * @property {string} [className=''] Name of the style class to be added
     */
    static propTypes = {
        visibility: PropTypes.oneOf([
            consts.visibility.PRIVATE.name,
            consts.visibility.TENANT.name,
            consts.visibility.GLOBAL.name]).isRequired,
        onVisibilityChange: PropTypes.func,
        disallowGlobal: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        onVisibilityChange: () => {},
        disallowGlobal: false,
        className: ''
    };

    onClick(){
        let visibilities = this.props.disallowGlobal? _.dropRight(VisibilityField.visibilitiesOrder) : VisibilityField.visibilitiesOrder;
        let index = visibilities.indexOf(this.props.visibility);
        if(index >= 0 && index < visibilities.length - 1) {
            this.props.onVisibilityChange(visibilities[index + 1]);
        } else{
            this.props.onVisibilityChange(visibilities[0]);
        }
    }

    render() {
        return (
            <VisibilityIcon visibility={this.props.visibility} link className={this.props.className} onClick={this.onClick.bind(this)} />
        );
    }
}

