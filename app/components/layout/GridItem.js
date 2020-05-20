/**
 * Created by kinneretzin on 13/12/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';

export default class GridItem extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        x: PropTypes.number,
        y: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
        className: PropTypes.string,
        onItemAdded: PropTypes.func,
        onItemRemoved: PropTypes.func,
        maximized: PropTypes.bool
    };

    static defaultProps = {
        x: 0,
        y: 0,
        width: 10,
        height: 5,
        className: '',
        maximized: false
    };

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
