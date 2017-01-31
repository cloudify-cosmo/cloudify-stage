/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Accordion } from 'semantic-ui-react'

class AccordionContent extends Component {

    static propTypes = {
        active: PropTypes.bool, //Whether or not the content is visible.
        children: PropTypes.any, //Primary content.
        className: PropTypes.string //Additional classes.
    };

    render() {
        return (
            <Accordion.Content {...this.props}/>
        );
    }
}

class AccordionTitle extends Component {

    static propTypes = {
        active: PropTypes.bool, //Whether or not the content is visible.
        children: PropTypes.any, //Primary content.
        className: PropTypes.string //Additional classes.
    };

    render() {
        return (
            <Accordion.Title {...this.props}/>
        );
    }
}

export default class AccordionWrapper extends Component {

    static Title = AccordionTitle;
    static Content = AccordionContent;

    static propTypes = {
        activeIndex: PropTypes.number, //Index of the currently active panel.
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        defaultActiveIndex: PropTypes.number, //Initial activeIndex value.
        exclusive: PropTypes.bool, //Only allow one panel open at a time
        fluid: PropTypes.bool, //Format to take up the width of it's container.
        inverted: PropTypes.bool, //Format for dark backgrounds.
        onTitleClick: PropTypes.any, //onTitleClick()
        panels: PropTypes.any, //Create simple accordion panels from an array of { text: <string>, content: <custom> } objects.
                               //Object can optionally define an `active` key to open/close the panel.
                               //Mutually exclusive with children.
        styled: PropTypes.bool, //Adds some basic styling to accordion panels.
    };

    render() {
        return (
            <Accordion {...this.props}/>
        );
    }
}