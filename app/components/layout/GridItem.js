/**
 * Created by kinneretzin on 13/12/2016.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class GridItem extends Component {
    componentDidMount() {
        const { id, onItemAdded } = this.props;
        if (onItemAdded) {
            onItemAdded(id);
        }
    }

    componentWillUnmount() {
        const { id, onItemRemoved } = this.props;
        if (onItemRemoved) {
            onItemRemoved(id);
        }
    }

    render() {
        const { children, className, id } = this.props;
        return (
            <div id={id} className={className}>
                {children}
            </div>
        );
    }
}

GridItem.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onItemAdded: PropTypes.func,
    onItemRemoved: PropTypes.func,

    // FIXME: These props are only used outside, in Grid component
    // eslint-disable-next-line react/no-unused-prop-types
    x: PropTypes.number,
    // eslint-disable-next-line react/no-unused-prop-types
    y: PropTypes.number,
    // eslint-disable-next-line react/no-unused-prop-types
    width: PropTypes.number,
    // eslint-disable-next-line react/no-unused-prop-types
    height: PropTypes.number
};

GridItem.defaultProps = {
    className: '',
    onItemAdded: _.noop,
    onItemRemoved: _.noop,

    x: 0,
    y: 0,
    width: 10,
    height: 5
};
