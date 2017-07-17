/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import {Form} from 'semantic-ui-react';

/**
 * Defines action bar including buttons which are displayed above the table
 *
 * ## Access
 * `Stage.Basic.DataTable.Action`
 *
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
            <Form.Field className="actionField">
                {this.props.children}
            </Form.Field>
        );
    }
}
 