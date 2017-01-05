/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class Paginator extends Component {

    static propTypes = {
        currentPage: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        totalSize: PropTypes.number.isRequired,
        onPageChange: PropTypes.func.isRequired
    };

    static pagerPositions = 5;

    render() {
        let pageCount = Math.ceil(this.props.totalSize/this.props.pageSize);

        if (pageCount <= 1) {
            return null;
        }

        let prevPageDisabled = this.props.currentPage == 1;
        let nextPageDisabled = this.props.currentPage == pageCount;

        let begin = pageCount <= Paginator.pagerPositions ?
                                     1 : Math.max(this.props.currentPage - Math.floor(Paginator.pagerPositions/2), 1);
        if (this.props.currentPage > Paginator.pagerPositions &&
            this.props.currentPage > pageCount - Math.floor(Paginator.pagerPositions/2)) {
            begin = pageCount - Paginator.pagerPositions + 1;
        }

        let end = Math.min(begin + Paginator.pagerPositions - 1, pageCount);

        var pagerElements = [];
        for (var i = begin; i <= end; i++) {
            if (begin>1 && pageCount > Paginator.pagerPositions && i==begin) {
                pagerElements.push(<a key={i} className={`item`}
                                      onClick={() => this.props.onPageChange(1)}>1</a>);
                if (begin>2) {
                    pagerElements.push(<a key={i + 1} className='item disabled'>...</a>);
                } else {
                    pagerElements.push(<a key={i + 1} className={`item`}
                                          onClick={() => this.props.onPageChange(2)}>2</a>);
                }
            } else if (end < pageCount && i==end) {
                if (end < pageCount - 1) {
                    pagerElements.push(<a key={i + 1} className='item disabled'>...</a>);
                } else {
                    pagerElements.push(<a key={i + 1} className={`item`}
                                          onClick={() => this.props.onPageChange(pageCount - 1)}>{pageCount - 1}</a>);
                }
                pagerElements.push(<a key={i + 2} className={`item`}
                                      onClick={() => this.props.onPageChange(pageCount)}>{pageCount}</a>);
            } else {
                (function(index, self){
                    pagerElements.push(<a key={index + 1} className={`item ${self.props.currentPage == index ? 'active' : ''}`}
                                      onClick={() => self.props.onPageChange(index)}>{index}</a>);
                })(i, this);
            }
        }

        return (
            <div className="ui right floated small pagination menu">
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
 