/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

const PAGER_POSITIONS = 4;

export default class Paginator extends Component {

    static propTypes = {
        currentPage: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        fetchSize: PropTypes.number.isRequired,
        onPageChange: PropTypes.func.isRequired
    };

    render() {
        if (this.props.currentPage <= 1 && this.props.fetchSize <  this.props.pageSize) {
            return null;
        }

        let prevPageDisabled = this.props.currentPage == 1;
        let nextPageDisabled = this.props.fetchSize <  this.props.pageSize;

        let begin = this.props.currentPage <= PAGER_POSITIONS ? 1 : Math.max(this.props.currentPage - Math.floor(PAGER_POSITIONS/2), 1);
        if (this.props.currentPage > PAGER_POSITIONS && this.props.currentPage > this.props.currentPage - Math.floor(PAGER_POSITIONS/2)) {
            begin = this.props.currentPage - PAGER_POSITIONS + 1;
        }

        var pagerElements = [];
        for (var i = begin; i <= this.props.currentPage; i++) {
            if (begin>1 && this.props.currentPage > PAGER_POSITIONS && i==begin) {
                pagerElements.push(<a key={i} className={`item`}
                                      onClick={() => this.props.onPageChange(1)}>1</a>);
                if (begin>2) {
                    pagerElements.push(<a key={i + 1} className='item disabled'>...</a>);
                } else {
                    pagerElements.push(<a key={i + 1} className={`item`}
                                          onClick={() => this.props.onPageChange(2)}>2</a>);
                }
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
 