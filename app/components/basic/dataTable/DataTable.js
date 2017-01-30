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

export default class GridTable extends Component {

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
        pageSize: PropTypes.number,
        sortColumn: PropTypes.string,
        sortAscending: PropTypes.bool,
        searchable: PropTypes.bool,
        selectable: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        fetchData: () => {
        },
        totalSize: -1,
        pageSize: 0,
        sortColumn: "",
        sortAscending: true,
        searchable: false,
        selectable: false,
        className: ""
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

        this.refs.pagination.reset();
        this.setState({sortColumn: name, sortAscending: ascending});
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

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.state, prevState)) {
            this._fetchData();
        }
    }

    _fetchData() {
        this.props.fetchData({gridParams: Object.assign({}, this.state, this.refs.pagination.state)});
    }

    render() {
        var headerColumns = [];
        var bodyRows = [];
        var gridAction = null;
        var gridFilters = [];

        var showCols = [];
        React.Children.forEach(this.props.children, function (child) {
            if (child && child.type) {
                if (child.type.name === "TableColumn") {
                    showCols.push(child.props.show);
                    headerColumns.push(child);
                } else if (child.type.name === "TableRow") {
                    bodyRows.push(React.cloneElement(child, {showCols}));
                } else if (child.type.name === "TableRowExpandable") {
                    let expandableContent = [];
                    React.Children.forEach(child.props.children, function (expChild) {
                        if (expChild && expChild.type) {
                            if (expChild.type.name === "TableRow") {
                                bodyRows.push(React.cloneElement(expChild, {showCols}));
                            } else if (expChild.type.name === "TableDataExpandable" && child.props.expanded) {
                                expandableContent.push(React.cloneElement(expChild, {numberOfColumns: showCols.length}));
                            }
                        }
                    });
                    bodyRows.push(expandableContent);
                } else if (child.type.name === "TableAction") {
                    gridAction = child;
                } else if (child.type.name === "TableFilter") {
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

                <Pagination totalSize={this.props.totalSize}
                            pageSize={this.props.pageSize}
                            fetchData={this._fetchData.bind(this)} ref="pagination">
                    <table
                        className={`ui very compact table sortable ${this.props.selectable ? 'selectable' : ''} ${this.props.className}`}
                        cellSpacing="0" cellPadding="0">
                        <thead>
                        <tr>
                            {headerColumns}
                        </tr>
                        </thead>
                        {this.props.totalSize === 0 ?
                            <tbody>
                            <tr className="noDataRow">
                                <td colSpan={headerColumns.length} className="center aligned">No data available</td>
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