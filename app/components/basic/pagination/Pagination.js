/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import PaginationInfo from './PaginationInfo';
import Paginator from './Paginator';

export default class Pagination extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            pageSize: props.pageSize,
            currentPage: 1,
        }

        this.disableStateUpdate = false;
    }

    static propTypes = {
        children: PropTypes.any.isRequired,
        fetchData: PropTypes.func.isRequired,
        pageSize: PropTypes.number.isRequired,
        totalSize: PropTypes.number.isRequired
    };

    static defaultProps = {
        totalSize: 0,
        pageSize: PaginationInfo.pageSizes[0]
    };

    _changePageSize(size){
        this.setState({pageSize: parseInt(size), currentPage: 1});
    }

    _changePage(page){
        this.setState({currentPage: page});
    }

    reset() {
        this.disableStateUpdate  = true;
        this._changePage(1);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.disableStateUpdate) {
            this.disableStateUpdate = false;
            return false;
        }

        return true;
    }

    componentWillReceiveProps(nextProps) {
        let changedProps = {};

        if (this.props.pageSize != nextProps.pageSize) {
            changedProps.pageSize = nextProps.pageSize;
        }

        let pageCount = Math.ceil(nextProps.totalSize/nextProps.pageSize);
        if (this.state.currentPage > pageCount) {
            changedProps.currentPage = 1;
        }

        if (!_.isEmpty(changedProps)) {
            this.setState(changedProps);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.state, prevState)) {
            this.props.fetchData({gridParams: {...this.state}});
        }
    }

    render() {
        return (
            <div>
                {this.props.children}

                { this.props.totalSize > PaginationInfo.pageSizes[0] &&
                    <div className="ui two column grid gridPagination">
                        <div className="column">
                            <PaginationInfo currentPage={this.state.currentPage} pageSize={this.state.pageSize}
                                            totalSize={this.props.totalSize}
                                            onPageSizeChange={this._changePageSize.bind(this)}/>
                        </div>
                        <div className="right aligned column">
                            <Paginator currentPage={this.state.currentPage} pageSize={this.state.pageSize}
                                       totalSize={this.props.totalSize} onPageChange={this._changePage.bind(this)}/>
                        </div>
                    </div>
                }
            </div>
        );
    }
}