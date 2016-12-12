/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import GridHeader from './GridHeader';
import GridBody from './GridBody';
import GridFooter from './GridFooter';
import GridRow from './GridRow';
import GridColumn from './GridColumn';
import GridData from './GridData';
import GridAction from './GridAction';
import PaginationInfo from './PaginationInfo';
import Pagination from './Pagination';
import Search from './Search';

class GridTable extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            sortColumn: _.get(props, "sortColumn", ""),
            sortAscending: _.get(props, "sortAscending", true),
            pageSize: _.get(props, "pageSize", 5),
            currentPage: 1,
            searchText: ""
        }
    }

    static propTypes = {
        children: PropTypes.any.isRequired,
        fetchData: PropTypes.func,
        pageSize: PropTypes.number,
        sortColumn: PropTypes.string,
        sortAscending: PropTypes.bool,
        totalSize: PropTypes.number,
        searchable: PropTypes.bool,
        data: PropTypes.any,
        idName: PropTypes.any
    };

    static defaultProps = {
        totalSize: 0,
        searchable: true
    };

    static childContextTypes = {
        getSortColumn: PropTypes.func,
        isSortAscending: PropTypes.func,
        sortColumn: PropTypes.func
    };

    getChildContext() {
        return {
            getSortColumn: ()=> this.state.sortColumn,
            isSortAscending: ()=> this.state.sortAscending,
            sortColumn: (name)=> this._sortColumn(name)
        };
    }

    _sortColumn(name) {
        let ascending = this.state.sortAscending;

        if (this.state.sortColumn === name) {
            ascending = !ascending;
        } else {
            ascending = true;
        }

        this.setState({sortColumn:name, sortAscending:ascending, currentPage: 1});
    }

    _changePageSize(size){
        this.setState({pageSize: parseInt(size), currentPage: 1});
    }

    _changePage(page){
        this.setState({currentPage: page});
    }

    _processData() {
        let processedData = this.props.data;

        if (this.state.sortColumn) {
            processedData = _.orderBy(processedData, [this.state.sortColumn, this.props.idName], [this.state.sortAscending?"asc":"desc", "asc"]);
        } else {
            processedData = _.orderBy(processedData, [this.props.idName], ["asc"]);
        }

        let start = (this.state.currentPage - 1) * this.state.pageSize;
        processedData = _.slice(processedData, start, start + this.state.pageSize)

        return processedData;
    }

    _fetchData() {
        if (this.props.data) {
            let processedData = this._processData();
            this.props.fetchData(processedData);
        } else {
            this.props.fetchData({...this.state});
        }
    }

    _getTotalSize() {
        return this.props.data ? this.props.data.length : this.props.totalSize;
    }

    componentDidMount() {
        if (this.props.data) {
            this._fetchData();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.state, prevState)) {
            this._fetchData();
        }
    }

    render() {
        var gridHeader = null;
        var gridBody = null;
        var gridFooter = null;
        var gridAction = null;

        React.Children.forEach(this.props.children, function(child) {
            if (child.type) {
                if (child.type.name === "GridHeader") {
                    gridHeader = child;
                } else if (child.type && child.type.name === "GridBody") {
                    gridBody = child;
                } else if (child.type && child.type.name === "GridFooter") {
                    gridFooter = child;
                } else if (child.type && child.type.name === "GridAction") {
                    gridAction = child;
                }
            }
        });

        return (
            <div className="ui grid">
                <div className="row no-bottom-padding">
                    <div className="seven wide column">
                        {this.props.searchable && <Search/>}
                    </div>
                    <div className="right aligned nine wide column">
                        {gridAction}
                    </div>
                </div>
                <div className="row">
                    <div className="sixteen wide column">
                        <table className="ui very compact table hover sortable" cellSpacing="0">
                            {this._getTotalSize() <= 0 && (
                                <tbody><tr className="noDataRow"><td colSpan="100" className="center aligned">No data available</td></tr></tbody>
                            )}

                            {gridHeader}
                            {gridBody}
                            {gridFooter}
                        </table>
                    </div>
                </div>
                <div className="row no-top-padding">
                    <div className="seven wide column">
                        <PaginationInfo currentPage={this.state.currentPage} pageSize={this.state.pageSize}
                                        totalSize={this._getTotalSize()} onPageSizeChange={this._changePageSize.bind(this)}/>
                    </div>
                    <div className="right aligned nine wide column">
                        <Pagination currentPage={this.state.currentPage} pageSize={this.state.pageSize}
                                    totalSize={this._getTotalSize()} onPageChange={this._changePage.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default {
    Table:GridTable,
    Header:GridHeader,
    Body:GridBody,
    Footer:GridFooter,
    Row:GridRow,
    Column:GridColumn,
    Data:GridData,
    Action:GridAction
};