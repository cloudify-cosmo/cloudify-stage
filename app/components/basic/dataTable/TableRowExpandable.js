/**
 * Created by jakubniezgoda on 11/01/2017.
 */

import React, { Component, PropTypes } from 'react';

/**
 * Defines expandable row in data table. Two <tr> elements are rendered by DataTable component from one DataTable.ExpandableRow component.
 *
 * ## Access
 * `Stage.Basic.DataTable.RowExpandable`
 *
 * ## Usage
 * ```
 * <DataTable.RowExpandable key="prestashop" expanded={true}>
 *      <DataTable.Row key="prestashop" selected={true} onClick={()=>this.onRowClick(item)}>
 *          <DataTable.Data><a href="javascript:void(0)">Prestashop store</a></DataTable.Data>
 *          <DataTable.Data>2017-01-05</DataTable.Data>
 *          <DataTable.Data>description for e-commerce solution</DataTable.Data>
 *      </DataTable.Row>
 *      <DataTable.DataExpandable>
 *          additional info when row becomes expanded
 *      </DataTable.DataExpandable>
 * </DataTable.RowExpandable>
 * ```
 */
export default class TableRowExpandable extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        expanded: PropTypes.bool
    };

    /**
     * @property {boolean} [expanded=false] - if true, then expandable part of the row will be shown
     */
    static defaultProps = {
        expanded: false
    };

    render() {
        return ({});
    }
}
