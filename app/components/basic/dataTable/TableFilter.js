/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

/**
 * Defines filter bar including filter fields which are displayed above the table
 * ## Usage
 *
 * ![TableFilter](manual/asset/dataTable/TableFilter_0.png)
 * ```
 *  <DataTable>
 *
 *      ...
 *
 *      <DataTable.Filter>
 *          <Input placeholder="Package name"/>
 *          <Input placeholder="Distribution"/>
 *      </DataTable.Filter>
 *
 *      <DataTable.Action>
 *          <Button content='Upload' icon='add' labelPosition='left' />
 *      </DataTable.Action>
 *
 *  </DataTable>
 * ```
 */
export default class TableFilter extends Component {

    /**
     * @property {object[]} children - filter fields
     * @property {string} [className=] - name of the style class to be added
     */
    static propTypes = {
        children: PropTypes.any.isRequired,
        className: PropTypes.string
    };

    render() {
        return (
            <div className={`field ${this.props.className}`}>
                {this.props.children}
            </div>
        );
    }
}
