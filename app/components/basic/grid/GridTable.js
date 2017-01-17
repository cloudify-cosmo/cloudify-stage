/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import GridRow from './GridRow';
import GridRowExpandable from './GridRowExpandable';
import GridColumn from './GridColumn';
import GridData from './GridData';
import GridDataExpandable from './GridDataExpandable';
import GridAction from './GridAction';
import GridFilter from './GridFilter';
import Pagination from '../pagination/Pagination';
import Search from './Search';

/**
 * Grid table component
 *
 * @example <caption>Grid table without pagination and with expandable row(s)</caption>
 * <Grid.Table selectable={true}>
 *
 *   <Grid.Column label="Name" name="id" width="40%"/>
 *   <Grid.Column label="Date" name="date" width="30%"/>
 *   <Grid.Column width="30%"/>
 *
 *   <Grid.Row key="drupal" selected={false} onClick={()=>this.onRowClick(item)}>
 *       <Grid.Data><a href="javascript:void(0)">Drupal application</a></Grid.Data>
 *       <Grid.Data>2016-03-04</Grid.Data>
 *       <Grid.Data>description for portal</Grid.Data>
 *   </Grid.Row>
 *
 *   <Grid.Row key="wordpress" selected={false} onClick={()=>this.onRowClick(item)}>
 *       <Grid.Data><a href="javascript:void(0)">Wordpress blog</a></Grid.Data>
 *       <Grid.Data>2016-01-05</Grid.Data>
 *       <Grid.Data>description for blog</Grid.Data>
 *   </Grid.Row>
 *
 *   <Grid.Row key="joomla" selected={false} onClick={()=>this.onRowClick(item)}>
 *       <Grid.Data><a href="javascript:void(0)">Joomla website</a></Grid.Data>
 *       <Grid.Data>2015-08-14</Grid.Data>
 *       <Grid.Data>description for website</Grid.Data>
 *   </Grid.Row>
 *
 *   <Grid.RowExpandable key="prestashop" expanded={true}>
 *     <Grid.Row key="prestashop" selected={true} onClick={()=>this.onRowClick(item)}>
 *       <Grid.Data><a href="javascript:void(0)">Prestashop store</a></Grid.Data>
 *       <Grid.Data>2017-01-05</Grid.Data>
 *       <Grid.Data>description for e-commerce solution</Grid.Data>
 *     </Grid.Row>
 *     <Grid.DataExpandable>
 *       additional info when row becomes expanded
 *     </Grid.DataExpandable>
 *   </Grid.RowExpandable>
 *
 * </Grid.Table>
 *
 * @example <caption>Grid table with pagination</caption>
 *
 * this.props = {
 *   fetchData: ...
 *   data: {
 *     items: [
 *       {
 *         id: ...,
 *         blueprint_id: ...,
 *         created_at: ...,
 *         blueprint_id: ...,
 *       }
 *       ...
 *     ],
 *     isSelected: ...,
 *     total: ...
 *   },
 *   onSelectDeployment: ...
 * }
 *
 * <Grid.Table fetchData={this.props.fetchData}
 *             totalSize={this.props.data.total}
 *             pageSize={this.props.widget.plugin.pageSize}
 *             selectable={true}
 *             className="deploymentTable">
 *
 *   <Grid.Column label="Name" name="id" width="25%"/>
 *   <Grid.Column label="Blueprint" name="blueprint_id" width="50%"/>
 *   <Grid.Column label="Created" name="created_at" width="25%"/>
 *
 *   {
 *     this.props.data.items.map((item)=>{
 *       return (
 *         <Grid.Row key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelectDeployment(item)}>
 *           <Grid.Data><a className='deploymentName' href="javascript:void(0)">{item.id}</a></Grid.Data>
 *           <Grid.Data>{item.blueprint_id}</Grid.Data>
 *           <Grid.Data>{item.created_at}</Grid.Data>
 *         </Grid.Row>
 *       );
 *     })
 *   }
 *
 * </Grid.Table>
 */

class GridTable extends Component {

    /**
     * constructor
     * @param {object} props
     * @param {object} context
     */
    constructor(props,context) {
        super(props,context);

        /**
         * @type {object}
         * @property {string} sortColumn column name used for data sorting
         * @property {boolean} sortAscending true for ascending sort, false for descending sort
         * @property {string} searchText grid table filtering string
         */
        this.state = {
            sortColumn: props.sortColumn,
            sortAscending: props.sortAscending,
            searchText: ""
        }
    }

    /**
     * propTypes
     * @property {function} [fetchData=()=>{}] function used to fetch table data
     * @property {number} [totalSize=-1] total number of rows in table
     * @property {number} [pageSize=0] number of page
     * @property {string} [sortColumn=""] column name used for data sorting
     * @property {boolean} [sortAscending=true] true for ascending sort, false for descending sort
     * @property {boolean} [searchable=false] if true filtering and searching input to be added
     * @property {boolean} [selectable=false] if true row can be selected and highlighted
     * @property {string} [className=""] name of the style class to be added to <table> tag
     */
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
        fetchData: ()=>{},
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

        this.refs.pagination.reset();
        this.setState({sortColumn:name, sortAscending:ascending});
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
        React.Children.forEach(this.props.children, function(child) {
            if (child && child.type) {
                if (child.type.name === "GridColumn") {
                    showCols.push(child.props.show);
                    headerColumns.push(child);
                } else if (child.type.name === "GridRow") {
                    bodyRows.push(React.cloneElement(child, {showCols}));
                } else if (child.type.name === "GridRowExpandable") {
                    let expandableContent = [];
                    React.Children.forEach(child.props.children, function(expChild) {
                        if (expChild && expChild.type) {
                            if (expChild.type.name === "GridRow") {
                                bodyRows.push(React.cloneElement(expChild, {showCols}));
                            } else if (expChild.type.name === "GridDataExpandable" && child.props.expanded) {
                                expandableContent.push(React.cloneElement(expChild, {numberOfColumns: showCols.length}));
                            }
                        }
                    });
                    bodyRows.push(expandableContent);
                } else if (child.type.name === "GridAction") {
                    gridAction = child;
                } else if (child.type.name === "GridFilter") {
                    gridFilters.push(child);
                }
            }
        });

        return (
            <div className={`gridTable ${this.props.className}`}>
                { (this.props.searchable || !_.isEmpty(gridFilters) || gridAction) &&
                    <div className="ui small form">
                        <div className="inline fields">
                            {this.props.searchable && <Search/>}
                            {gridFilters}
                            {gridAction}
                        </div>
                    </div>
                }

                <Pagination totalSize={this.props.totalSize}
                            pageSize={this.props.pageSize}
                            fetchData={this._fetchData.bind(this)} ref="pagination">
                    <table className={`ui very compact table sortable ${this.props.selectable?'selectable':''} ${this.props.className}`} cellSpacing="0" cellPadding="0">
                        <thead><tr>
                            {headerColumns}
                        </tr></thead>
                        {this.props.totalSize === 0 ?
                            <tbody><tr className="noDataRow"><td colSpan={headerColumns.length} className="center aligned">No data available</td></tr></tbody>
                            :
                            <tbody>{bodyRows}</tbody>
                        }
                    </table>
                </Pagination>

            </div>
        );
    }
}

export default {
    Table:GridTable,
    Row:GridRow,
    RowExpandable:GridRowExpandable,
    Column:GridColumn,
    Data:GridData,
    DataExpandable:GridDataExpandable,
    Action:GridAction,
    Filter:GridFilter
};