/**
 * Created by kinneretzin on 13/12/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class GridItem extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        x: PropTypes.number,
        y: PropTypes.number,
        width : PropTypes.number,
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
        if (this.props.onItemAdded) {
            this.props.onItemAdded(this.props.id);
        }
    }

    componentWillUnmount() {
        if (this.props.onItemRemoved) {
            this.props.onItemRemoved(this.props.id);
        }
    }

    render() {
        return (
            <div 
                id={this.props.id}
                ref='item'
                className={this.props.className}
            >
                {this.props.children}
            </div>
        );
    }
}

