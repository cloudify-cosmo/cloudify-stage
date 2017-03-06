/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import { Dropdown } from 'semantic-ui-react'

export default class PaginationInfo extends Component {

    static propTypes = {
        currentPage: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        totalSize: PropTypes.number,
        onPageSizeChange: PropTypes.func.isRequired,
        fetchSize: PropTypes.number,
        simple: PropTypes.bool,
    };

    static pageSizes = [5, 10, 25, 50, 100];

    _handleChange(e, { value }) {
        this.props.onPageSizeChange(value);
    }

    render() {
        if ((!this.props.simple && this.props.totalSize <= 0) ||
            (this.props.simple && this.props.currentPage == 1 && this.props.fetchSize < PaginationInfo.pageSizes[0])) {
            return null;
        }

        let start = (this.props.currentPage-1)*this.props.pageSize + 1;
        let stop = this.props.simple ? start + this.props.fetchSize - 1 :
                                       Math.min(start + this.props.pageSize - 1, this.props.totalSize);

        if (start > stop) {
            start = stop;
        }

        let options = _.map(PaginationInfo.pageSizes, item => { return {text: item, value: item} });
        if (_.indexOf(PaginationInfo.pageSizes, this.props.pageSize) < 0) {
            options.unshift({text: this.props.pageSize, value: this.props.pageSize});
        }

        return (
            <div className="ui small form">
                Page size:&nbsp;

                <Dropdown compact search selection allowAdditions value={this.props.pageSize} additionLabel="Set "
                          closeOnBlur={false}
                          options={options} onChange={this._handleChange.bind(this)} className="upward"/>

                &nbsp;&nbsp;{start} to {stop}

                {
                    !this.props.simple &&
                    <span>&nbsp;of {this.props.totalSize} entries</span>
                }

            </div>
        );
    }
}
 