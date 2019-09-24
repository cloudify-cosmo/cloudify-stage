/**
 * Created by pawelposel on 17/11/2016.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TableDataCell from './TableDataCell';

/**
 * Defines table rows, renders <tr> elements.
 *
 * ## Access
 * `Stage.Basic.DataTable.Row`
 *
 * ## Usage
 *
 * ```
 * <DataTable.Row key="joomla" selected={false} onClick={()=>this.onRowClick(item)}>
 *      <DataTable.Data><a href="javascript:void(0)">Joomla website</a></DataTable.Data>
 *      <DataTable.Data>2015-08-14</DataTable.Data>
 *      <DataTable.Data>description for website</DataTable.Data>
 * </DataTable.Row>
 * ```
 */
export default class TableRow extends Component {
    /**
     * @property {object[]} children - row content
     * @property {boolean} [selected=false] - if true, then row will be marked as selected
     * @property {Function} onClick - action to be executed on click event
     * @property {string[]} showCols - array of column's names to be shown
     * @property {string} [className] - name of the style class to be added
     */
    static propTypes = {
        children: PropTypes.any.isRequired,
        selected: PropTypes.bool,
        onClick: PropTypes.func,
        showCols: PropTypes.array,
        className: PropTypes.string
    };

    static defaultProps = {
        selected: false,
        showCols: [],
        className: ''
    };

    _showData(index) {
        return index < this.props.showCols.length ? this.props.showCols[index] : true;
    }

    render() {
        const className =
            this.props.className +
            (_.isFunction(this.props.onClick) ? ' clickable' : '') +
            (this.props.selected ? ' active' : '');
        const children = [];
        let index = 0;
        React.Children.forEach(this.props.children, child => {
            if (child.type === TableDataCell && this._showData(index++)) {
                children.push(child);
            }
        });

        return (
            <tr
                id={this.props.id}
                className={className}
                onClick={this.props.onClick}
                onMouseOver={this.props.onMouseOver}
                onMouseOut={this.props.onMouseOut}
            >
                {children}
            </tr>
        );
    }
}
