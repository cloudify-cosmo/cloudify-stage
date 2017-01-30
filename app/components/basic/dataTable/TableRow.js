/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class TableRow extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        selected: PropTypes.bool,
        onClick: PropTypes.func,
        showCols: PropTypes.array
    };

    static defaultProps = {
        selected: false,
        showCols:[]
    };

    _showData(index) {
        return index < this.props.showCols.length ? this.props.showCols[index] : true;
    }

    render() {
        let children = [];
        let index = 0;
        React.Children.forEach(this.props.children, (child) => {
            if (child.type && child.type.name === "TableDataCell" && this._showData(index++)) {
                children.push(child);
            }
        });

        return (
            <tr className={this.props.selected ? "active" : ""} onClick={this.props.onClick}>
                {children}
            </tr>
        );
    }
}
