/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import TableDataCell from "./TableDataCell";

export default class TableRow extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        selected: PropTypes.bool,
        onClick: PropTypes.func,
        showCols: PropTypes.array,
        className: PropTypes.string
    };

    static defaultProps = {
        selected: false,
        showCols:[],
        className: ""
    };

    _showData(index) {
        return index < this.props.showCols.length ? this.props.showCols[index] : true;
    }

    render() {
        let children = [];
        let index = 0;
        React.Children.forEach(this.props.children, (child) => {
            if (child.type && child.type === TableDataCell && this._showData(index++)) {
                children.push(child);
            }
        });

        return (
            <tr id={this.props.id} className={`${this.props.selected ? "active" : ""} ${this.props.className}`} onClick={this.props.onClick}>
                {children}
            </tr>
        );
    }
}
