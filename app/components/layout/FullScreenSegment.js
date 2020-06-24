/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Segment } from '../basic';

export default function FullScreenSegment({ children }) {
    return <Segment className="logoPage">{children}</Segment>;
}

FullScreenSegment.propTypes = {
    children: PropTypes.node.isRequired
};
