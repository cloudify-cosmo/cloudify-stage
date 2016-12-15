/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class GridRow extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        select: PropTypes.bool,
        onClick: PropTypes.func,
        showCols: PropTypes.array
    };

    static defaultProps = {
        select: false,
        showCols:[]
    };

    _showData(index) {
        return index < this.props.showCols.length ? this.props.showCols[index] : true;
    }

    render() {
        var showAll = true;
        for (var i=0; i<this.props.showCols.length; i++) {
            showAll = showAll && this.props.showCols[i];
        }

        let children = [];
        if (showAll) {
            children = this.props.children;
        } else {
            let index = 0;
            React.Children.forEach(this.props.children, (child) => {
                if (child.type && child.type.name === "GridData" && this._showData(index++)) {
                    children.push(child);
                }
            });
        }

        return (
            <tr className={this.props.select?"active":""} onClick={this.props.onClick}>
                {children}
            </tr>
        );
    }
}
