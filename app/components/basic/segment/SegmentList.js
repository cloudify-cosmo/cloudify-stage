/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import SegmentItem from './SegmentItem';
import Pagination from '../pagination/Pagination';

class SegmentList extends Component {

    constructor(props,context) {
        super(props,context);
    }

    static propTypes = {
        children: PropTypes.any.isRequired,
        fetchData: PropTypes.func.isRequired,
        totalSize: PropTypes.number.isRequired,
        pageSize: PropTypes.number,
        className: PropTypes.string
    };

    static defaultProps = {
        className: ""
    };

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.state, prevState)) {
            this.props.fetchData({gridParams: {...this.state}});
        }
    }

    render() {
        return (
            <div className={`segmentList ${this.props.className}`}>
                <Pagination totalSize={this.props.totalSize} pageSize={this.props.pageSize} fetchData={this.props.fetchData}>
                    {this.props.totalSize <= 0 ?
                        <div className="ui icon message">
                            <i className="ban icon"></i>
                            No data available
                        </div>
                        :
                        this.props.children
                    }
                </Pagination>
            </div>
        );
    }
}

export default {
    List:SegmentList,
    Item:SegmentItem
};