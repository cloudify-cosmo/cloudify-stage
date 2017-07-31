/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
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
     * @property {function} onClick - action to be executed on click event
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
        showCols:[],
        className: ''
    };

    _showData(index) {
        return index < this.props.showCols.length ? this.props.showCols[index] : true;
    }

    render() {
        let className = this.props.className + (_.isFunction(this.props.onClick) ? ' clickable' : '') + (this.props.selected ? ' active' : '');
        let children = [];
        let index = 0;
        React.Children.forEach(this.props.children, (child) => {
            if (child.type && child.type === TableDataCell && this._showData(index++)) {
                children.push(child);
            }
        });

        return (
            <tr id={this.props.id} className={className} onClick={this.props.onClick}>
                {children}
            </tr>
        );
    }
}
