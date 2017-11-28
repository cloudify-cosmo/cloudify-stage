/**
 * Created by pposel on 08/05/2017.
 */

import React, { Component, PropTypes } from 'react';
import {Icon} from 'semantic-ui-react';
import PopupConfirm from './PopupConfirm';

/**
 * ResourceAvailability - an icon representing resource availability, if onSetGlobal prop is set as function it allows
 * to change resource availability from tenant to global showing confirmation popup on click
 *
 * ## Access
 * `Stage.Basic.ResourceAvailability`
 *
 * ## Usage
 *
 * ### ResourceAvailability (show)
 *
 * ![ResourceAvailability](manual/asset/resourceAvailability/ResourceAvailability_0.png)
 * ```
 * <ResourceAvailability availability={ResourceAvailability.PRIVATE} />
 * <ResourceAvailability availability={ResourceAvailability.TENANT} />
 * <ResourceAvailability availability={ResourceAvailability.GLOBAL} />
 *```
 */
export default class ResourceAvailability extends Component {

    /**
     *
     */
    static PRIVATE = 'private';

    /**
     *
     */
    static TENANT = 'tenant';

    /**
     *
     */
    static GLOBAL = 'global';

    /**
     * @property {string} availability resource availability - in ['private', 'tenant, 'global']
     * @property {string} [onSetGlobal=''] function to be called when user confirm changing availability to global
     * @property {string} [className=''] Name of the style class to be added
     */
    static propTypes = {
        availability: PropTypes.oneOf([
            ResourceAvailability.PRIVATE,
            ResourceAvailability.TENANT,
            ResourceAvailability.GLOBAL]).isRequired,
        onSetGlobal: PropTypes.func,
        className: PropTypes.string
    };

    static defaultProps = {
        className: '',
    };

    render() {
        const ICON_PROP = {
            [ResourceAvailability.PRIVATE]: {name: 'lock', color: 'red', title: 'Private resource'},
            [ResourceAvailability.TENANT]: {name: 'user', color: 'green', title: 'Tenant resource'},
            [ResourceAvailability.GLOBAL]: {name: 'globe', color: 'blue', title: 'Global resource'}
        }
        let setGlobalAllowed = _.isFunction(this.props.onSetGlobal) && _.isEqual(this.props.availability, ResourceAvailability.TENANT);
        let icon = <Icon name={ICON_PROP[this.props.availability].name}
                         color={ICON_PROP[this.props.availability].color}
                         title={ICON_PROP[this.props.availability].title}
                         className={this.props.className} link={setGlobalAllowed}
                         onClick={e => e.stopPropagation()} />;

        return (
            setGlobalAllowed
            ?
                <PopupConfirm trigger={icon}
                              content='Are you sure you want to change resource availability to global?'
                              onConfirm={this.props.onSetGlobal} />
            :
                icon
        )
    }
}

