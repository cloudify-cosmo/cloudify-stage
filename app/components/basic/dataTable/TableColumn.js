/**
 * Created by pawelposel on 17/11/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';

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
     * @property {any} label - column label
     * @property {string} [name] - data property, enables column sorting
     * @property {string} [width] - width style
     * @property {boolean} [show=true] - if false then column is hidden
     * @property {boolean} [centerAligned=false] - if true then column label is center aligned
     */
    static propTypes = {
        label: PropTypes.any,
        name: PropTypes.string,
        width: PropTypes.string,
        show: PropTypes.bool,
        centerAligned: PropTypes.bool
    };

    static defaultProps = {
        width: '',
        show: true,
        centerAligned: false
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
        let cssClass = this.props.name ? '' : 'disabled';

        if (this.context.getSortColumn() === this.props.name) {
            cssClass += ' sorted';
            cssClass += this.context.isSortAscending() ? ' ascending' : ' descending ';
        }

        if (this.props.centerAligned) {
            cssClass += ' center aligned';
        }

        return cssClass;
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        return (
            <th
                className={this._className()}
                style={this.props.width ? { width: this.props.width } : {}}
                onClick={this._onClick.bind(this)}
            >
                {this.props.label}
            </th>
        );
    }
}
