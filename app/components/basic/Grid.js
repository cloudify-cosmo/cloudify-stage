/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Grid } from 'semantic-ui-react'

class GridColumn extends Component {

    static propTypes = {
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        color: PropTypes.string, //A grid column can be colored.
        computer: PropTypes.string, //A column can specify a width for a computer.
        floated: PropTypes.string, //A column can sit flush against the left or right edge of a row.
        largeScreen: PropTypes.string, //A column can specify a width for a large screen device.
        mobile: PropTypes.string, //A column can specify a width for a mobile device.
        only: PropTypes.string, //A column can appear only for a specific device, or screen sizes.
        stretched: PropTypes.bool, //An can stretch its contents to take up the entire grid or row height.
        tablet: PropTypes.string, //A column can specify a width for a tablet device.
        textAlign: PropTypes.string, //A row can specify its text alignment.
        verticalAlign: PropTypes.string, //A column can specify its vertical alignment to have all its columns vertically centered.
        widescreen: PropTypes.string, //A column can specify a width for a wide screen device.
        width: PropTypes.string, //Represents width of column.
    };

    render() {
        return (
            <Grid.Column {...this.props}/>
        );
    }
}

class GridRow extends Component {

    static propTypes = {
        centered: PropTypes.bool, //A row can have its columns centered.
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        color: PropTypes.string, //A grid row can be colored.
        columns: PropTypes.string, //Represents column count per line in Row.
        divided: PropTypes.bool, //A row can have dividers between its columns.
        only: PropTypes.string, //A row can appear only for a specific device, or screen sizes.
        reversed: PropTypes.string, //A row can specify that its columns should reverse order at different device sizes.
        stretched: PropTypes.bool, //An can stretch its contents to take up the entire column height.
        textAlign: PropTypes.string, //A row can specify its text alignment.
        verticalAlign: PropTypes.string, //A row can specify its vertical alignment to have all its columns vertically centered.
    };

    render() {
        return (
            <Grid.Row {...this.props}/>
        );
    }
}

export default class GridWrapper extends Component {

    static Column = GridColumn;
    static Row = GridRow;

    static propTypes = {
        celled: PropTypes.bool, //A grid can have rows divided into cells.
        centered: PropTypes.bool, //A grid can have its columns centered.
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        columns: PropTypes.string, //Represents column count per row in Grid.
        container: PropTypes.bool, //A grid can be combined with a container to use avaiable layout and alignment
        divided: PropTypes.bool, //A grid can have dividers between its columns.
        doubling: PropTypes.bool, //A grid can double its column width on tablet and mobile sizes.
        padded: PropTypes.bool, //A grid can preserve its vertical and horizontal gutters on first and last columns.
        relaxed: PropTypes.bool, //A grid can increase its gutters to allow for more negative space.
        reversed: PropTypes.string, //A grid can specify that its columns should reverse order at different device sizes.
        stackable: PropTypes.bool, //A grid can have its columns stack on-top of each other after reaching mobile breakpoints.
        stretched: PropTypes.bool, //An can stretch its contents to take up the entire grid height.
        textAlign: PropTypes.string, //A grid can specify its text alignment.
        verticalAlign: PropTypes.string //A grid can specify its vertical alignment to have all its columns vertically centered.
    };

    render() {
        return (
            <Grid {...this.props}/>
        );
    }
}
