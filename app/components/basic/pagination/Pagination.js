/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import PaginationInfo from './PaginationInfo';
import TotalSizePaginator from './TotalSizePaginator';
import FetchSizePaginator from './FetchSizePaginator';

export default class Pagination extends Component {

    static PAGE_SIZE_LIST = PaginationInfo.pageSizes;

    constructor(props,context) {
        super(props,context);

        this.state = {
            pageSize: props.pageSize,
            currentPage: 1
        }

        this.disableStateUpdate = false;
    }

    static propTypes = {
        children: PropTypes.any.isRequired,
        fetchData: PropTypes.func.isRequired,
        pageSize: PropTypes.number.isRequired,
        totalSize: PropTypes.number,
        fetchSize: PropTypes.number,
        sizeMultiplier: PropTypes.number
    };

    static defaultProps = {
        totalSize: 0,
        fetchSize: 0,
        sizeMultiplier: 5,
        pageSize: Pagination.PAGE_SIZE_LIST(5)[0]
    };

    _changePageSize(size){
        var fetchParams = {pageSize: parseInt(size) || Pagination.PAGE_SIZE_LIST(this.props.sizeMultiplier)[0], currentPage: 1};
        (this.props.fetchData(fetchParams) || Promise.resolve()).then(() => this.setState(fetchParams));
    }

    _changePage(page){
        var fetchParams = {currentPage: page, pageSize: this.state.pageSize};
        (this.props.fetchData(fetchParams) || Promise.resolve()).then(() => this.setState(fetchParams));
    }

    reset(){
        this.setState({currentPage: 1});
    }

    componentWillReceiveProps(nextProps) {
        let changedProps = {};

        if (this.props.pageSize != nextProps.pageSize) {
            changedProps.pageSize = nextProps.pageSize;
        }

        if (nextProps.totalSize > 0) {
            let pageCount = Math.ceil(nextProps.totalSize / nextProps.pageSize);
            if (this.state.currentPage > pageCount) {
                changedProps.currentPage = 1;
            }
        }

        if (!_.isEmpty(changedProps)) {
            this.setState(changedProps);
        }
    }

    render() {
        return (
            <div>
                {this.props.children}

                { (this.props.totalSize > Pagination.PAGE_SIZE_LIST(this.props.sizeMultiplier)[0] || this.props.fetchSize > 0 || this.state.currentPage > 1) &&
                    <div className="ui two column grid gridPagination">
                        <div className="column">
                            <PaginationInfo currentPage={this.state.currentPage} pageSize={this.state.pageSize}
                                            totalSize={this.props.totalSize} fetchSize={this.props.fetchSize}
                                            onPageSizeChange={this._changePageSize.bind(this)} sizeMultiplier={this.props.sizeMultiplier}/>
                        </div>
                        <div className="right aligned column">
                            {
                                this.props.totalSize > 0 ?
                                <TotalSizePaginator currentPage={this.state.currentPage} pageSize={this.state.pageSize}
                                                    totalSize={this.props.totalSize} onPageChange={this._changePage.bind(this)}/>
                                :
                                <FetchSizePaginator currentPage={this.state.currentPage} pageSize={this.state.pageSize}
                                                    fetchSize={this.props.fetchSize} onPageChange={this._changePage.bind(this)}/>
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}