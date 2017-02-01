/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { List } from 'semantic-ui-react'

class ListContent extends Component {

    static propTypes = {
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        content: PropTypes.any, //Shorthand for primary content.
        description: PropTypes.any, //Shorthand for ListDescription.
        floated: PropTypes.string, //An list content can be floated left or right.
        header: PropTypes.any, //Shorthand for ListHeader.
        verticalAlign: PropTypes.string //An element inside a list can be vertically aligned.
    };

    render() {
        return (
            <List.Content {...this.props}/>
        );
    }
}

class ListDescription extends Component {

    static propTypes = {
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        content: PropTypes.any //Shorthand for primary content.
    };

    render() {
        return (
            <List.Description {...this.props}/>
        );
    }
}

class ListHeader extends Component {

    static propTypes = {
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        content: PropTypes.any //Shorthand for primary content.
    };

    render() {
        return (
            <List.Header {...this.props}/>
        );
    }
}

class ListIcon extends Component {

    static propTypes = {
        className: PropTypes.string, //Additional classes.
        verticalAlign: PropTypes.string //An element inside a list can be vertically aligned.
    };

    render() {
        return (
            <List.Icon {...this.props}/>
        );
    }
}

class ListItem extends Component {

    static propTypes = {
        active: PropTypes.bool, //A list item can active.
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        content: PropTypes.any, //Shorthand for primary content.
        description: PropTypes.any, //Shorthand for ListDescription.
        disabled: PropTypes.bool, //A list item can disabled.
        header: PropTypes.any, //Shorthand for ListHeader.
        icon: PropTypes.any, //Shorthand for ListIcon.
        image: PropTypes.any, //Shorthand for Image.
        value: PropTypes.string //A value for an ordered list.
    };

    render() {
        return (
            <List.Item {...this.props}/>
        );
    }
}

class ListList extends Component {

    static propTypes = {
        children: PropTypes.any, //Primary content.
        className: PropTypes.string //Additional classes.
    };

    render() {
        return (
            <List.List {...this.props}/>
        );
    }
}

export default class ListWrapper extends Component {

    static Content = ListContent;
    static Description = ListDescription;
    static Header = ListHeader;
    static Icon = ListIcon;
    static Item = ListItem;
    static List = ListList;

    static propTypes = {
        animated: PropTypes.bool, //A list can animate to set the current item apart from the list.
        bulleted: PropTypes.bool, //A list can mark items with a bullet.
        celled: PropTypes.bool, //A list can divide its items into cells.
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        divided: PropTypes.bool, //A list can show divisions between content.
        floated: PropTypes.string, //An list can be floated left or right.
        horizontal: PropTypes.bool, //A list can be formatted to have items appear horizontally.
        inverted: PropTypes.bool, //A list can be inverted to appear on a dark background.
        items: PropTypes.any, //Shorthand array of props for ListItem.
        link: PropTypes.bool, //A list can be specially formatted for navigation links.
        ordered: PropTypes.bool, //A list can be ordered numerically.
        relaxed: PropTypes.bool, //A list can relax its padding to provide more negative space.
        selection: PropTypes.bool, //A selection list formats list items as possible choices.
        size: PropTypes.string, //A list can vary in size.
        verticalAlign: PropTypes.string //An element inside a list can be vertically aligned.
    };

    render() {
        return (
            <List {...this.props}/>
        );
    }
}
