/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Dropdown } from 'semantic-ui-react'

export default class DropdownWrapper extends Component {

    static Divider = Dropdown.Divider;
    static Header = Dropdown.Header;
    static Item = Dropdown.Item;
    static Menu = Dropdown.Menu;

    static propTypes = Dropdown.propTypes;

    static defaultProps = {
        selectOnBlur: false,
        openOnFocus: false
    };

    render() {
        return (
            <Dropdown {...this.props}/>
        );
    }
}
