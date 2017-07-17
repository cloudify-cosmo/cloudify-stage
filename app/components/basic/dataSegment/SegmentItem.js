/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import {Segment} from 'semantic-ui-react';


/**
 * SegmentItem is a component showing content item for {@link DataSegment} component
 *
 * ## Access
 * `Stage.Basic.DataSegment.Item`
 *
 * ## Usage
 *
 * ![SegmentItem_0](manual/asset/dataSegment/DataSegment_0.png)
 *
 * ```
 * <DataSegment>
 *
 *     <DataSegment.Item>
 *         <h2>SegmentItem 1</h2>
 *     </DataSegment.Item>
 *
 *     <DataSegment.Item>
 *         <h2>SegmentItem 2</h2>
 *     </DataSegment.Item>
 *
 *     <DataSegment.Item>
 *         <h2>SegmentItem 3</h2>
 *     </DataSegment.Item>
 *
 *     <DataSegment.Item>
 *         <h2>SegmentItem 4</h2>
 *     </DataSegment.Item>
 *
 * </DataSegment>
 * ```
 */
export default class SegmentItem extends Component {

    /**
     * propTypes
     * @property {object[]} children - primary content
     * @property {boolean} [selected=false] - specifies if data segment item shall be selected
     * @property {function} [onClick=()=>{}] - specifies function to be called on action click
     * @property {string} [className=''] - CSS classname
     */
    static propTypes = {
        children: PropTypes.any.isRequired,
        selected: PropTypes.bool,
        onClick: PropTypes.func,
        className: PropTypes.string
    };

    static defaultProps = {
        selected: false,
        className: ''
    };

    render() {
        let className = this.props.className + (_.isFunction(this.props.onClick) ? ' clickable' : '');
        return (
            <Segment secondary={this.props.selected} inverted={this.props.selected} className={className} onClick={this.props.onClick}>
                {this.props.children}
            </Segment>
        );
    }
}
