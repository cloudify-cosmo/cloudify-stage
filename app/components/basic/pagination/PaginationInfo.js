/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import { Dropdown } from '../index'

export default class PaginationInfo extends Component {

    static propTypes = {
        currentPage: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        totalSize: PropTypes.number,
        onPageSizeChange: PropTypes.func.isRequired,
        fetchSize: PropTypes.number,
        sizeMultiplier: PropTypes.number
    };

    static defaultProps = {
        currentPage: 1,
        totalSize: -1,
        fetchSize: -1,
        sizeMultiplier: 5
    };

    static pageSizes = (multiplier) => [1, 2, 3, 5, 10].map(item => multiplier * item);

    _handleChange(e, { value }) {
        this.props.onPageSizeChange(value);
    }

    render() {
        if (this.props.totalSize <= 0 && this.props.fetchSize <= 0 && this.props.currentPage == 1) {
            return null;
        }

        let start = (this.props.currentPage-1)*this.props.pageSize + 1;
        let stop = this.props.totalSize > 0 ? Math.min(start + this.props.pageSize - 1, this.props.totalSize)
                                            : start + this.props.fetchSize - 1;

        if (start > stop) {
            start = stop;
        }

        var pageSizes = PaginationInfo.pageSizes(this.props.sizeMultiplier);

        let options = _.map(pageSizes, item => { return {text: item, value: item} });
        if (_.indexOf(pageSizes, this.props.pageSize) < 0) {
            options.unshift({text: this.props.pageSize, value: this.props.pageSize});
        }

        return (
            <div className="ui small form">
                Page size:&nbsp;

                <Dropdown compact search selection allowAdditions value={this.props.pageSize} additionLabel="Set "
                          options={options} onChange={this._handleChange.bind(this)} id="pageSizeField"/>

                &nbsp;&nbsp;{start} to {stop}

                {
                    this.props.totalSize > 0 &&
                    <span>&nbsp;of {this.props.totalSize} entries</span>
                }

            </div>
        );
    }
}
 