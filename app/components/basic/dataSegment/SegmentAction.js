/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import {Form} from 'semantic-ui-react';

/**
 * SegmentAction is a component showing action bar including buttons displayed above the segments
 *
 * ## Access
 * `Stage.Basic.DataSegment.Action`
 *
 * ## Usage
 *
 * ![SegmentAction](manual/asset/dataSegment/SegmentAction_0.png)
 * ```
 *  <DataSegment>
 *
 *      ...
 *
 *      <DataSegment.Action>
 *          <Button content='Upload' icon='upload' labelPosition='left' />;
 *      </DataSegment.Action>
 *
 *  </DataSegment>
 * ```
 */
export default class SegmentAction extends Component {

    /**
     * propTypes
     * @property {object[]} children - primary content
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
 