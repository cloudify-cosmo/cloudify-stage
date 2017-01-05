/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class PaginationInfo extends Component {

    static propTypes = {
        currentPage: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        totalSize: PropTypes.number.isRequired,
        onPageSizeChange: PropTypes.func.isRequired
    };

    static pageSizes = [5, 10, 25, 50, 100];

    render() {
        if (this.props.totalSize <= 0) {
            return null;
        }

        let start = (this.props.currentPage-1)*this.props.pageSize + 1;
        let stop = Math.min(start + this.props.pageSize - 1, this.props.totalSize);

        return (
            <div className="ui small form">
                Page size:&nbsp;
                <div className="ui compact selection dropdown" ref={(select)=>$(select).dropdown({onChange: this.props.onPageSizeChange, direction: 'upward'})}>
                    <i className="dropdown icon"></i>
                    <div className="text">{this.props.pageSize}</div>
                    <div className="menu">
                        {
                            PaginationInfo.pageSizes.map((item)=>{
                                return <div key={item} className={`item ${item==this.props.pageSize?'selected active':''}`}>{item}</div>
                            })
                        }
                    </div>
                </div>

                &nbsp;&nbsp;{start} to {stop} of {this.props.totalSize} entries

            </div>
        );
    }
}
 