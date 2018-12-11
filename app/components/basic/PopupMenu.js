/**
 * Created by pposel on 22/02/2017.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {Popup, Icon} from './index';

/**
 * PopupMenu is a component which uses [Popup](https://react.semantic-ui.com/modules/popup) component to create
 * dropdown menu triggered by [Icon](https://react.semantic-ui.com/elements/icon) button.
 *
 * ## Access
 * `Stage.Basic.PopupMenu`
 *
 * ## Usage
 * ![PopupMenu](manual/asset/PopupMenu.png)
 * ```
 * <PopupMenu>
 *     <Menu pointing vertical>
 *         <Menu.Item icon='users' content="Edit group's users" name='users' />
 *         <Menu.Item icon='user' content="Edit group's tenants" name='tenants' />
 *         <Menu.Item icon='trash' content='Delete' name='delete' />
 *     </Menu>
 * </PopupMenu>
 * ```
 */
export default class PopupMenu extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            opened: false
        }
    }

    /**
     * propTypes
     * @property {object[]} children primary content
     * @property {string} [className=''] additional CSS classes to be applied to popup trigger
     * @property {string} [position='bottom right'] position for the popover.
     * @property {number} [offset=12] horizontal offset in pixels to be applied to popup
     * @property {string} [icon='content'] popup trigger icon name (see [Icon](https://react.semantic-ui.com/elements/icon))
     * @property {boolean} [disabled=false] specifies if trigger shall be disabled
     * @property {boolean} [bordered=false] specifies if icon shall be bordered
     * @property {string} [help=''] additional popup help message shown on trigger hover
     */
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.any.isRequired,
        position: PropTypes.string,
        offset: PropTypes.number,
        icon: PropTypes.string,
        disabled: PropTypes.bool,
        bordered: PropTypes.bool,
        help: PropTypes.string
    };

    static defaultProps = {
        className: '',
        position: 'bottom right',
        offset: 12,
        icon: 'content',
        disabled: false,
        bordered: false,
        help: ''
    };

    render () {
        let trigger = _.isEmpty(this.props.help)
            ?
                <Icon link={!this.props.disabled} disabled={this.props.disabled} name={this.props.icon}
                      bordered={this.props.bordered} className={this.props.className} onClick={(e) => {e.stopPropagation();}} />
            :
                <span onClick={(e) => {e.stopPropagation();}}>
                    <Popup trigger={<Icon name={this.props.icon} bordered={this.props.bordered}
                                          link={!this.props.disabled} className={this.props.className} />}
                           content={this.props.help} />
                </span>;

        return (
            <Popup trigger={trigger} on='click' position={this.props.position} className='popupMenu' offset={this.props.offset}
                   open={this.props.disabled ? false : this.state.opened}
                   onClose={()=>this.setState({opened: false})}
                   onOpen={()=>this.setState({opened: true})}
                   onClick={(e)=>{e.stopPropagation(); this.setState({opened: false})}}>

                {this.props.children}

            </Popup>
        );
    }
}
