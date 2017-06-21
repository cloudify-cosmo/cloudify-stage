/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

/**
 * Defines action bar including buttons which are displayed above the table
 * ## Usage
 *
 * ![TableAction](manual/asset/dataTable/TableAction_0.png)
 * ```
 *  <DataTable>
 *
 *      ...
 *
 *      <DataTable.Action>
 *          <Button content='Create' icon='add' labelPosition='left' />
 *      </DataTable.Action>
 *
 *  </DataTable>
 * ```
 */
export default class TableAction extends Component {

    /**
     * @property {object[]} children - action buttons
     */
    static propTypes = {
        children: PropTypes.any.isRequired,
    };

    render() {
        return (
            <div className="field actionField">
                {this.props.children}
            </div>
        );
    }
}
 