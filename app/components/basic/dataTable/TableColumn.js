/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

/**
 * Defines table columns, renders <th> elements.
 *
 * ## Access
 * `Stage.Basic.DataTable.Column`
 *
 * ## Usage
 *
 * ```
 * <DataTable.Column label="Name" name="id" width="40%"/>
 * ```
 */
export default class TableColumn extends Component {

    /**
     * @property {string} label - column label
     * @property {string} [name] - data property, enables column sorting
     * @property {string} [width] - width style
     * @property {boolean} [show=true] - if false then column is hidden
     */
    static propTypes = {
        label: PropTypes.string,
        name: PropTypes.string,
        width: PropTypes.string,
        show: PropTypes.bool
    };

    static defaultProps = {
        width: "",
        show: true
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
            cssClass += " sorted";
            cssClass += this.context.isSortAscending() ? " ascending" : " descending ";
        }

        return cssClass;
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        return (
            <th className={this._className()} style={this.props.width?{width:this.props.width}:{}} onClick={this._onClick.bind(this)}>
                {this.props.label}
            </th>
        );
    }
}
 