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
        trigger: PropTypes.any
    };

    render () {
        let trigger = this.props.trigger || <Icon link name="content" className={this.props.className} onClick={(e)=>{e.stopPropagation();}}/>;

        return (
            <Popup trigger={trigger} on='click' positioning="bottom right" className="popupMenu" offset={12}
                   open={this.state.opened}
                   onClose={()=>this.setState({opened: false})}
                   onOpen={()=>this.setState({opened: true})}
                   onClick={(e)=>{e.stopPropagation(); this.setState({opened: false})}}>

                {this.props.children}

            </Popup>
        );
    }
}
