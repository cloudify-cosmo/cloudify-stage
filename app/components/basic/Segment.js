/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Segment } from 'semantic-ui-react'

export default class SegmentWrapper extends Component {

    static propTypes = {
        attached: PropTypes.bool, //Attach segment to other content, like a header.
        basic: PropTypes.bool, //A basic segment has no special formatting.
        children: PropTypes.any, //Primary content.
        circular: PropTypes.bool, //A segment can be circular.
        className: PropTypes.string, //Additional classes.
        clearing: PropTypes.bool, //A segment can clear floated content.
        color: PropTypes.string, //Segment can be colored.
        compact: PropTypes.bool, //A segment may take up only as much space as is necessary.
        disabled: PropTypes.bool, //A segment may show its content is disabled.
        floated: PropTypes.string, //Segment content can be floated to the left or right.
        inverted: PropTypes.bool, //A segment can have its colors inverted for contrast.
        loading: PropTypes.bool, //A segment may show its content is being loaded.
        padded: PropTypes.bool, //A segment can increase its padding.
        piled: PropTypes.bool, //Formatted to look like a pile of pages.
        raised: PropTypes.bool, //A segment may be formatted to raise above the page.
        secondary: PropTypes.bool, //A segment can be formatted to appear less noticeable.
        size: PropTypes.string, //A segment can have different sizes.
        stacked: PropTypes.bool, //Formatted to show it contains multiple pages.
        tertiary: PropTypes.bool, //A segment can be formatted to appear even less noticeable.
        textAlign: PropTypes.string, //Formats content to be aligned as part of a vertical group.
        vertical: PropTypes.bool, //Formats content to be aligned vertically.
    };

    render() {
        return (
            <Segment {...this.props}/>
        );
    }
}
