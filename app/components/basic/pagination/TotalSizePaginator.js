/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import { Menu } from 'semantic-ui-react'

const PAGER_POSITIONS = 5;

export default class TotalSizePaginator extends Component {

    static propTypes = {
        currentPage: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        totalSize: PropTypes.number.isRequired,
        onPageChange: PropTypes.func.isRequired
    };

    render() {
        let pageCount = Math.ceil(this.props.totalSize/this.props.pageSize);

        if (pageCount <= 1) {
            return null;
        }

        let prevPageDisabled = this.props.currentPage == 1;
        let nextPageDisabled = this.props.currentPage == pageCount;

        let begin = pageCount <= PAGER_POSITIONS ? 1 : Math.max(this.props.currentPage - Math.floor(PAGER_POSITIONS/2), 1);
        if (this.props.currentPage > PAGER_POSITIONS && this.props.currentPage > pageCount - Math.floor(PAGER_POSITIONS/2)) {
            begin = pageCount - PAGER_POSITIONS + 1;
        }

        let end = Math.min(begin + PAGER_POSITIONS - 1, pageCount);

        var pagerElements = [];
        for (var i = begin; i <= end; i++) {
            if (begin>1 && pageCount > PAGER_POSITIONS && i==begin) {
                pagerElements.push(<Menu.Item key={i} content="1" onClick={() => this.props.onPageChange(1)}/>);
                if (begin>2) {
                    pagerElements.push(<Menu.Item key={i + 1} content="..." className='disabled'/>);
                } else {
                    pagerElements.push(<Menu.Item key={i+1} content="2" onClick={() => this.props.onPageChange(2)}/>);
                }
            } else if (end < pageCount && i==end) {
                if (end < pageCount - 1) {
                    pagerElements.push(<Menu.Item key={i + 1} content="..." className='disabled'/>);
                } else {
                    pagerElements.push(<Menu.Item key={i+1} content={pageCount - 1} onClick={() => this.props.onPageChange(pageCount - 1)}/>);
                }
                pagerElements.push(<Menu.Item key={i+2} content={pageCount} onClick={() => this.props.onPageChange(pageCount)}/>);
            } else {
                (function(index, self){
                    pagerElements.push(<Menu.Item key={index+1} active={self.props.currentPage == index} content={index}
                                                  onClick={() => self.props.onPageChange(index)}/>);
                })(i, this);
            }
        }

        return (
            <Menu pagination floated="right" size="small">
                <Menu.Item icon="angle left" link className={prevPageDisabled?'disabled':''}
                           onClick={()=>{if (!prevPageDisabled) this.props.onPageChange(this.props.currentPage - 1)}} />

                {pagerElements}

                <Menu.Item icon="angle right" link className={nextPageDisabled?'disabled':''}
                           onClick={()=>{if (!nextPageDisabled) this.props.onPageChange(this.props.currentPage + 1)}} />
            </Menu>
        );
    }
}
 