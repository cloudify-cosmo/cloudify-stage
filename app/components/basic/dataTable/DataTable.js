/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import TableRow from './TableRow';
import TableRowExpandable from './TableRowExpandable';
import TableColumn from './TableColumn';
import TableDataCell from './TableDataCell';
import TableDataExpandable from './TableDataExpandable';
import TableAction from './TableAction';
import TableFilter from './TableFilter';
import TableSearch from './TableSearch';
import Pagination from '../pagination/Pagination';

export default class DataTable extends Component {

    static Row = TableRow;
    static Column = TableColumn;
    static Data = TableDataCell;
    static Action = TableAction;
    static Filter = TableFilter;
    static RowExpandable = TableRowExpandable;
    static DataExpandable = TableDataExpandable;

    constructor(props, context) {
        super(props, context);

        this.state = {
            sortColumn: props.sortColumn,
            sortAscending: props.sortAscending,
            searchText: ""
        }
    }

    static propTypes = {
        children: PropTypes.any.isRequired,
        fetchData: PropTypes.func,
        totalSize: PropTypes.number,
        fetchSize: PropTypes.number,
        pageSize: PropTypes.number,
        sortColumn: PropTypes.string,
        sortAscending: PropTypes.bool,
        searchable: PropTypes.bool,
        selectable: PropTypes.bool,
        className: PropTypes.string,
        noDataAvailable: PropTypes.bool,
        sizeMultiplier: PropTypes.number
    };

    static defaultProps = {
        fetchData: () => Promise.resolve(),
        totalSize: -1,
        fetchSize: -1,
        pageSize: 0,
        sortColumn: "",
        sortAscending: true,
        searchable: false,
        selectable: false,
        className: "",
        noDataAvailable: false,
        sizeMultiplier: 5
    };

    static childContextTypes = {
        getSortColumn: PropTypes.func,
        isSortAscending: PropTypes.func,
        sortColumn: PropTypes.func
    };

    getChildContext() {
        return {
            getSortColumn: () => this.state.sortColumn,
            isSortAscending: () => this.state.sortAscending,
            sortColumn: (name) => this._sortColumn(name)
        };
    }

    _sortColumn(name) {
        let ascending = this.state.sortAscending;

        if (this.state.sortColumn === name) {
            ascending = !ascending;
        } else {
            ascending = true;
        }

        var fetchData = {sortColumn: name, sortAscending: ascending, currentPage: 1};
        (this._fetchData(fetchData) || Promise.resolve()).then(() => {
            this.setState(fetchData)
            this.refs.pagination.reset();
        });
    }

    componentWillReceiveProps(nextProps) {
        let changedProps = {};
        if (this.props.sortColumn != nextProps.sortColumn) {
            changedProps.sortColumn = nextProps.sortColumn;
        }
        if (this.props.sortAscending != nextProps.sortAscending) {
            changedProps.sortAscending = nextProps.sortAscending;
        }

        if (!_.isEmpty(changedProps)) {
            this.setState(changedProps);
        }
    }

    _fetchData(fetchParams) {
        return this.props.fetchData({gridParams: fetchParams});
    }

    render() {
        var headerColumns = [];
        var bodyRows = [];
        var gridAction = null;
        var gridFilters = [];

        var showCols = [];
        React.Children.forEach(this.props.children, function (child) {
            if (child && child.type) {
                if (child.type === TableColumn) {
                    showCols.push(child.props.show);
                    headerColumns.push(child);
                } else if (child.type === TableRow) {
                    bodyRows.push(React.cloneElement(child, {showCols}));
                } else if (child.type === TableRowExpandable) {
                    let expandableContent = [];
                    React.Children.forEach(child.props.children, function (expChild) {
                        if (expChild && expChild.type) {
                            if (expChild.type === TableRow) {
                                bodyRows.push(React.cloneElement(expChild, {showCols}));
                            } else if (expChild.type === TableDataExpandable && child.props.expanded) {
                                expandableContent.push(React.cloneElement(expChild, {numberOfColumns: showCols.length}));
                            }
                        }
                    });
                    bodyRows.push(expandableContent);
                } else if (child.type === TableAction) {
                    gridAction = child;
                } else if (child.type === TableFilter) {
                    gridFilters.push(child);
                }
            }
        });

        return (
            <div className={`gridTable ${this.props.className}`}>
                { (this.props.searchable || !_.isEmpty(gridFilters) || gridAction) &&
                <div className="ui small form">
                    <div className="inline fields">
                        {this.props.searchable && <TableSearch/>}
                        {gridFilters}
                        {gridAction}
                    </div>
                </div>
                }

                <Pagination totalSize={this.props.totalSize} pageSize={this.props.pageSize} sizeMultiplier={this.props.sizeMultiplier}
                            fetchSize={this.props.fetchSize} fetchData={this._fetchData.bind(this)} ref="pagination">
                    <table
                        className={`ui very compact table sortable ${this.props.selectable ? 'selectable' : ''} ${this.props.className}`}
                        cellSpacing="0" cellPadding="0">
                        <thead>
                            <tr>
                                {headerColumns}
                            </tr>
                        </thead>
                        {this.props.noDataAvailable || (this.props.totalSize <= 0 && this.props.fetchSize <= 0 &&
                         (this.props.totalSize === 0 || this.props.fetchSize === 0)) ?
                            <tbody>
                                <tr className="noDataRow">
                                    <td colSpan={headerColumns.length} className="center aligned">
                                    {this.props.fetchSize === 0 && this.refs.pagination && this.refs.pagination.state.currentPage > 1 ?
                                        <span>No more data available</span>
                                        :
                                        <span>No data available</span>
                                    }
                                    </td>
                                </tr>
                            </tbody>
                            :
                            <tbody>{bodyRows}</tbody>
                        }
                    </table>
                </Pagination>

            </div>
        );
    }
}