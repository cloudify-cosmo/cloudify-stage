/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class GridColumn extends Component {

    static propTypes = {
        label: PropTypes.string,
        name: PropTypes.string,
        width: PropTypes.string
    };

    static defaultProps = {
        width: ""
    };

    static contextTypes = {
        getSortColumn: PropTypes.func.isRequired,
        isSortAscending: PropTypes.func.isRequired,
        sortColumn: PropTypes.func.isRequired
    };

    _onClick() {
        if (this.props.name) {
            this.context.sortColumn(this.props.name);
        }
    }

    _className() {
        let cssClass = this.props.name ? "" : "disabled";

        if (this.context.getSortColumn() === this.props.name) {
            cssClass += " sorted"
            cssClass += this.context.isSortAscending() ? " ascending" : " descending ";
        }

        return cssClass;
    }

    render() {
        return (
            <th className={this._className()} style={this.props.width?{width:this.props.width}:{}} onClick={this._onClick.bind(this)}>
                {this.props.label}
            </th>
        );
    }
}
 