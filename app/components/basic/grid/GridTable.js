/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import GridRow from './GridRow';
import GridColumn from './GridColumn';
import GridData from './GridData';
import GridAction from './GridAction';
import GridFilter from './GridFilter';
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
        fetchData: PropTypes.func.isRequired,
        totalSize: PropTypes.number.isRequired,
        pageSize: PropTypes.number,
        sortColumn: PropTypes.string,
        sortAscending: PropTypes.bool,
        searchable: PropTypes.bool,
        selectable: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        totalSize: 0,
        searchable: true,
        selectable: false
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

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.state, prevState)) {
            this.props.fetchData({gridParams: {...this.state}});
        }
    }

    render() {
        var headerColumns = [];
        var bodyRows = [];
        var gridAction = null;
        var gridFilters = [];

        var showCols = [];
        React.Children.forEach(this.props.children, function(child) {
            if (child && child.type) {
                if (child.type.name === "GridColumn") {
                    showCols.push(child.props.show);
                    headerColumns.push(child);
                } else if (child.type && child.type.name === "GridRow") {
                    bodyRows.push(React.cloneElement(child, {showCols}));
                } else if (child.type && child.type.name === "GridAction") {
                    gridAction = child;
                } else if (child.type && child.type.name === "GridFilter") {
                    gridFilters.push(child);
                }
            }
        });

        return (
            <div className="ui grid gridTable">
                <div className="sixteen wide column gridAction">
                    <div className="ui form">
                        <div className="inline fields">
                            {this.props.searchable && <Search/>}
                            {gridFilters}
                            {gridAction}
                        </div>
                    </div>
                </div>

                <div className="sixteen wide column">
                    <table className={`ui very compact table sortable ${this.props.selectable?'selectable':''} ${this.props.className}`} cellSpacing="0" cellPadding="0">
                        <thead><tr>
                            {headerColumns}
                        </tr></thead>
                        {this.props.totalSize <= 0 ?
                            <tbody><tr className="noDataRow"><td colSpan={headerColumns.length} className="center aligned">No data available</td></tr></tbody>
                         :
                            <tbody>{bodyRows}</tbody>
                        }
                    </table>
                </div>

                {this.props.totalSize > 0 &&
                    <div className="row gridPagination">
                        <div className="seven wide column">
                            <PaginationInfo currentPage={this.state.currentPage} pageSize={this.state.pageSize}
                                            totalSize={this.props.totalSize}
                                            onPageSizeChange={this._changePageSize.bind(this)}/>
                        </div>
                        <div className="right aligned nine wide column">
                            <Pagination currentPage={this.state.currentPage} pageSize={this.state.pageSize}
                                        totalSize={this.props.totalSize} onPageChange={this._changePage.bind(this)}/>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default {
    Table:GridTable,
    Row:GridRow,
    Column:GridColumn,
    Data:GridData,
    Action:GridAction,
    Filter:GridFilter
};