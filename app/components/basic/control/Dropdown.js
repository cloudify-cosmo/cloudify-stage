/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Dropdown } from 'semantic-ui-react'

class DropdownDivider extends Component {

    static propTypes = {
        className: PropTypes.string,
    }

    render() {
        return (
            <Dropdown.Divider {...this.props}/>
        );
    }
}

class DropdownHeader extends Component {

    static propTypes = {
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        content: PropTypes.any, //Shorthand for primary content.
        icon: PropTypes.any //Shorthand for Icon.
    }

    render() {
        return (
            <Dropdown.Header {...this.props}/>
        );
    }
}

class DropdownItem extends Component {

    static propTypes = {
        active: PropTypes.bool, //Style as the currently chosen item.
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        content: PropTypes.any, //Shorthand for primary content.
        description: PropTypes.string, //Additional text with less emphasis.
        disabled: PropTypes.bool, //A dropdown item can be disabled.
        flag: PropTypes.bool, //Shorthand for Flag.
        icon: PropTypes.any, //Shorthand for Icon.
        image: PropTypes.any, //Shorthand for Image.
        label: PropTypes.any, //Shorthand for Label.
        onClick: PropTypes.func, //Called on click.
        selected: PropTypes.bool, //The item currently selected by keyboard shortcut.
        text: PropTypes.any, //Display text.
        value: PropTypes.any //Stored value
    }

    render() {
        return (
            <Dropdown.Item {...this.props}/>
        );
    }
}

class DropdownMenu extends Component {

    static propTypes = {
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        scrolling: PropTypes.bool //A dropdown menu can scroll.
    }

    render() {
        return (
            <Dropdown.Menu {...this.props}/>
        );
    }
}

export default class DropdownWrapper extends Component {

    static Divider = DropdownDivider;
    static Header = DropdownHeader;
    static Item = DropdownItem;
    static Menu = DropdownMenu;

    static propTypes = {
        additionLabel: PropTypes.string, //Label prefixed to an option added by a user.
        additionPosition: PropTypes.string, //Position of the `Add: ...` option in the dropdown list ('top' or 'bottom').
        allowAdditions:  PropTypes.bool, //Allow user additions to the list of options (boolean). Requires the use of `selection`, `options` and `search`.
        basic: PropTypes.bool, //A Dropdown can reduce its complexity
        button: PropTypes.bool, //Format the Dropdown to appear as a button.
        children: PropTypes.any,
        className: PropTypes.string,
        closeOnBlur: PropTypes.bool, //Whether or not the menu should close when the dropdown is blurred.
        compact: PropTypes.bool, //A compact dropdown has no minimum width.
        defaultOpen: PropTypes.bool, //Initial value of open.
        defaultSelectedLabel: PropTypes.string, //Currently selected label in multi-select.
        defaultValue: PropTypes.any, //{string|number|arrayOf} Initial value or value array if multiple.
        disabled: PropTypes.bool, //A disabled dropdown menu or item does not allow user interaction.
        error: PropTypes.bool, //An errored dropdown can alert a user to a problem.
        floating: PropTypes.bool, //A dropdown menu can contain floated content.
        fluid: PropTypes.bool, //A dropdown can take the full width of its parent
        header: PropTypes.node, //A dropdown menu can contain a header.
        icon: PropTypes.any, //Shorthand for Icon.
        inline: PropTypes.bool, //A dropdown can be formatted to appear inline in other content.
        labeled: PropTypes.bool, //A dropdown can be labeled.
        loading: PropTypes.bool, //A dropdown can show that it is currently loading data.
        multiple: PropTypes.bool, //A selection dropdown can allow multiple selections.
        noResultsMessage: PropTypes.string, //Message to display when there are no results.
        onAddItem: PropTypes.func, //Called when a user adds a new item. Use this to update the options list.
        onClose: PropTypes.func, //Called when a close event happens.
        onLabelClick: PropTypes.func, //Called when a multi-select label is clicked.
        onOpen: PropTypes.func, //Called when an open event happens.
        onSearchChange: PropTypes.func, //Called on search input change.
        open: PropTypes.bool, //Controls whether or not the dropdown menu is displayed.
        openOnFocus: PropTypes.bool, //Whether or not the menu should open when the dropdown is focused.
        options: PropTypes.any, //Array of Dropdown.Item props e.g. `{ text: '', value: '' }`
        placeholder: PropTypes.string, //Placeholder text.
        pointing: PropTypes.any, //A dropdown can be formatted so that its menu is pointing.
        scrolling: PropTypes.bool, //A dropdown can have its menu scroll.
        search: PropTypes.bool, //A selection dropdown can allow a user to search through a large list of choices.
        selectOnBlur: PropTypes.bool, //Define whether the highlighted item should be selected on blur.
        selectedLabel: PropTypes.any, //Currently selected label in multi-select.
        selection: PropTypes.bool, //A dropdown can be used to select between choices in a form.
        simple: PropTypes.bool, //A simple dropdown can open without Javascript.
        text: PropTypes.string, //The text displayed in the dropdown, usually for the active item.
    };

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
