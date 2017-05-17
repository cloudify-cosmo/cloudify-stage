/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import SegmentItem from './SegmentItem';
import SegmentAction from './SegmentAction';
import Pagination from '../pagination/Pagination';

export default class DataSegment extends Component {

    static Item = SegmentItem;
    static Action = SegmentAction;

    constructor(props,context) {
        super(props,context);
    }

    static propTypes = {
        children: PropTypes.any.isRequired,
        fetchData: PropTypes.func.isRequired,
        totalSize: PropTypes.number,
        fetchSize: PropTypes.number,
        pageSize: PropTypes.number,
        className: PropTypes.string,
        sizeMultiplier: PropTypes.number
    };

    static defaultProps = {
        className: "",
        fetchData: () => {},
        totalSize: -1,
        fetchSize: -1,
        pageSize: 0,
        sizeMultiplier: 3
    };

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.state, prevState)) {
            this._fetchData();
        }
    }

    _fetchData(fetchParams) {
        return this.props.fetchData({gridParams: Object.assign({}, this.state, fetchParams)});
    }

    render() {
        var segmentAction = null;
        var children = [];

        React.Children.forEach(this.props.children, function(child) {
            if (child && child.type) {
                if (child.type === SegmentAction) {
                    segmentAction = child;
                } else {
                    children.push(child);
                }
            }
        });

        return (
            <div className={`segmentList ${this.props.className}`}>
                {
                    segmentAction &&
                    <div className="ui small form">
                        <div className="inline fields">
                            {segmentAction}
                        </div>
                    </div>
                }

                <Pagination totalSize={this.props.totalSize} pageSize={this.props.pageSize} sizeMultiplier={this.props.sizeMultiplier}
                            fetchData={this._fetchData.bind(this)} fetchSize={this.props.fetchSize} ref="pagination">
                    {this.props.totalSize <= 0 && this.props.fetchSize <= 0 &&
                     (this.props.totalSize === 0 || this.props.fetchSize === 0) ?
                        <div className="ui icon message">
                            <i className="ban icon"></i>
                            {this.props.fetchSize === 0 && this.refs.pagination && this.refs.pagination.state.currentPage > 1 ?
                                <span>No more data available</span>
                                :
                                <span>No data available</span>
                            }
                        </div>
                        :
                        children
                    }
                </Pagination>
            </div>
        );
    }
}
