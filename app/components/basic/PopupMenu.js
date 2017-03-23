/**
 * Created by pposel on 22/02/2017.
 */

import React, { Component, PropTypes } from 'react';
import {Popup, Icon} from './index';

export default class PopupMenu extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            opened: false
        }
    }

    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.any.isRequired,
        position: PropTypes.string,
        offset: PropTypes.number,
        icon: PropTypes.string,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        position: 'bottom right',
        offset: 12,
        icon: 'content',
        disabled: false
    }

    render () {
        let trigger = <Icon link={!this.props.disabled} disabled={this.props.disabled} name={this.props.icon} className={this.props.className} onClick={(e)=>{e.stopPropagation();}}/>;

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
