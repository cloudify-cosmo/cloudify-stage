/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class PaginationInfo extends Component {

    static propTypes = {
        currentPage: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        totalSize: PropTypes.number.isRequired,
        onPageChange: PropTypes.func.isRequired
    };

    render() {
        if (this.props.totalSize <= 0) {
            return null;
        }

        const pagerPositions = 5;

        let pageCount = Math.ceil(this.props.totalSize/this.props.pageSize);
        let prevPageDisabled = this.props.currentPage == 1;
        let nextPageDisabled = this.props.currentPage == pageCount;

        let begin = Math.max(this.props.currentPage - Math.floor(pagerPositions/2), 1);
        if (this.props.currentPage > pagerPositions && this.props.currentPage > pageCount - Math.floor(pagerPositions/2)) {
            begin = pageCount - pagerPositions + 1;
        }
        let end = Math.min(begin + pagerPositions - 1, pageCount);

        var pagerElements = [];
        for (var i = begin; i <= end; i++) {
            if (begin>1 && i==begin) {
                pagerElements.push(<a key={1} className='item' title="First page"
                                  onClick={() => this.props.onPageChange(1)}>...</a>);
            } else if (end < pageCount && i==end) {
                pagerElements.push(<a key={pageCount} className='item' title={`Last page ${pageCount}`}
                                  onClick={() => this.props.onPageChange(pageCount)}>...</a>);
            } else {
                (function(index, self){
                    pagerElements.push(<a key={index} className={`item ${self.props.currentPage == index ? 'active' : ''}`}
                                      onClick={() => self.props.onPageChange(index)}>{index}</a>);
                })(i, this);
            }
        }

        return (
            <div className="ui right floated pagination menu">
                <a className={`icon item ${prevPageDisabled?'disabled':''}`}
                   onClick={()=>{if (!prevPageDisabled) this.props.onPageChange(this.props.currentPage - 1)}}>
                    <i className="link angle left icon"></i>
                </a>

                {pagerElements}

                <a className={`icon item ${nextPageDisabled?'disabled':''}`}
                   onClick={()=>{if (!nextPageDisabled) this.props.onPageChange(this.props.currentPage + 1)}}>
                    <i className="link angle right icon"></i>
                </a>
            </div>
        );
    }
}
 