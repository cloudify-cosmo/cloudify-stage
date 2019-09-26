/**
 * Created by pawelposel on 17/11/2016.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import Pagination from '../pagination/Pagination';
import TableAction from './TableAction';
import TableColumn from './TableColumn';
import TableDataCell from './TableDataCell';
import TableDataExpandable from './TableDataExpandable';
import TableFilter from './TableFilter';
import TableRow from './TableRow';
import TableRowExpandable from './TableRowExpandable';
import TableSearch from './TableSearch';

/**
 * DataTable component enables fetching data using predefined function and showing tabular data in a simple manner.
 *
 * ## Features
 * - data pagination
 * - selectable rows
 * - expandable rows
 * - data sorting by columns
 *
 * ## Access
 * `Stage.Basic.DataTable`
 *
 * ## Usage
 *
 * ### DataTable with pagination
 *
 * ![DataTable](manual/asset/dataTable/DataTable_0.png)
 * ```
 * this.props = {
 *      fetchData: ...
 *      data: {
 *          items: [
 *              {
 *                  id: ...,
 *                  blueprint_id: ...,
 *                  created_at: ...,
 *                  isSelected: ...
 *              }
 *              ...
 *          ],
 *          total: ...
 *      },
 *      onSelectDeployment: ...
 * }
 *
 * <DataTable fetchData={this.props.fetchData}
 *            totalSize={this.props.data.total}
 *            pageSize={this.props.widget.configuration.pageSize}
 *            selectable={true}
 *            className="deploymentTable">
 *
 *      <DataTable.Column label="Name" name="id" width="25%"/>
 *      <DataTable.Column label="Blueprint" name="blueprint_id" width="50%"/>
 *      <DataTable.Column label="Created" name="created_at" width="25%"/>
 *
 *      {
 *          this.props.data.items.map((item)=>{
 *              return (
 *                  <DataTable.Row key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelectDeployment(item)}>
 *                      <DataTable.Data><a className='deploymentName' href="javascript:void(0)">{item.id}</a></DataTable.Data>
 *                      <DataTable.Data>{item.blueprint_id}</DataTable.Data>
 *                      <DataTable.Data>{item.created_at}</DataTable.Data>
 *                  </DataTable.Row>
 *              );
 *          })
 *      }
 *
 * </DataTable>
 * ```
 *
 * ### DataTable with action bar
 *
 * ![DataTable](manual/asset/dataTable/DataTable_1.png)
 * ```
 * <DataTable fetchData={this.props.fetchGridData}
 *      totalSize={this.props.data.total}
 *      pageSize={this.props.widget.configuration.pageSize}
 *      sortColumn={this.props.widget.configuration.sortColumn}
 *      sortAscending={this.props.widget.configuration.sortAscending}
 *      selectable={true}>
 *
 *      <DataTable.Column label="Name" name="id" width="30%"/>
 *      <DataTable.Column label="Created" name="created_at" width="15%"/>
 *      <DataTable.Column label="Updated" name="updated_at" width="15%"/>
 *      <DataTable.Column label="Creator" name='created_by' width="15%"/>
 *      <DataTable.Column label="# Deployments" width="15%"/>
 *      <DataTable.Column width="10%"/>
 *
 *      {
 *          this.props.data.items.map((item)=>{
 *              return (
 *                  <DataTable.Row key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelectBlueprint(item)}>
 *                      <DataTable.Data>{item.created_at}</DataTable.Data>
 *                      <DataTable.Data>{item.updated_at}</DataTable.Data>
 *                      <DataTable.Data>{item.created_by}</DataTable.Data>
 *                      <DataTable.Data><div className="ui green horizontal label">{item.depCount}</div></DataTable.Data>
 *                      <DataTable.Data className="center aligned rowActions">
 *                          <i className="rocket icon link bordered" title="Create deployment" onClick={(event)=>{event.stopPropagation();this.props.onCreateDeployment(item)}}></i>
 *                          <i className="trash icon link bordered" title="Delete blueprint" onClick={(event)=>{event.stopPropagation();this.props.onDeleteBlueprint(item)}}></i>
 *                      </DataTable.Data>
 *                  </DataTable.Row>
 *              );
 *          })
 *      }
 *
 *      <DataTable.Action>
 *          <UploadModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
 *      </DataTable.Action>
 *
 *  </DataTable>
 * ```
 *
 * ### DataTable with expandable row and without pagination
 *
 * ![DataTable](manual/asset/dataTable/DataTable_2.png)
 * ```
 * <DataTable selectable={true}>
 *
 *      <DataTable.Column label="Name" name="id" width="40%"/>
 *      <DataTable.Column label="Date" name="date" width="30%"/>
 *      <DataTable.Column width="30%"/>
 *
 *      <DataTable.Row key="drupal" selected={false} onClick={()=>this.onRowClick(item)}>
 *          <DataTable.Data><a href="javascript:void(0)">Drupal application</a></DataTable.Data>
 *          <DataTable.Data>2016-03-04</DataTable.Data>
 *          <DataTable.Data>description for portal</DataTable.Data>
 *      </DataTable.Row>
 *
 *      <DataTable.Row key="wordpress" selected={false} onClick={()=>this.onRowClick(item)}>
 *          <DataTable.Data><a href="javascript:void(0)">Wordpress blog</a></DataTable.Data>
 *          <DataTable.Data>2016-01-05</DataTable.Data>
 *          <DataTable.Data>description for blog</DataTable.Data>
 *      </DataTable.Row>
 *
 *      <DataTable.Row key="joomla" selected={false} onClick={()=>this.onRowClick(item)}>
 *          <DataTable.Data><a href="javascript:void(0)">Joomla website</a></DataTable.Data>
 *          <DataTable.Data>2015-08-14</DataTable.Data>
 *          <DataTable.Data>description for website</DataTable.Data>
 *      </DataTable.Row>
 *
 *      <DataTable.RowExpandable key="prestashop" expanded={true}>
 *          <DataTable.Row key="prestashop" selected={true} onClick={()=>this.onRowClick(item)}>
 *              <DataTable.Data><a href="javascript:void(0)">Prestashop store</a></DataTable.Data>
 *              <DataTable.Data>2017-01-05</DataTable.Data>
 *              <DataTable.Data>description for e-commerce solution</DataTable.Data>
 *          </DataTable.Row>
 *          <DataTable.DataExpandable>
 *              additional info when row becomes expanded
 *          </DataTable.DataExpandable>
 *      </DataTable.RowExpandable>
 *
 * </DataTable>
 * ```
 * ### No data available if total size is 0 or noDataAvailable prop is set
 *
 * ![DataTable](manual/asset/dataTable/DataTable_3.png)
 * ```
 * <DataTable noDataAvailable={this.props.data.items.length == 0}>
 *      <DataTable.Column label="Name" name="id" width="25%"/>
 *      <DataTable.Column label="Blueprint" name="blueprint_id" width="50%"/>
 *      <DataTable.Column label="Created" name="created_at" width="25%"/>
 *
 *      {
 *          this.props.data.items.map((item)=>{
 *              return (
 *                  <DataTable.Row key={item.id} selected={item.isSelected} onClick={()=>this.props.onSelectDeployment(item)}>
 *                      <DataTable.Data><a className='deploymentName' href="javascript:void(0)">{item.id}</a></DataTable.Data>
 *                      <DataTable.Data>{item.blueprint_id}</DataTable.Data>
 *                      <DataTable.Data>{item.created_at}</DataTable.Data>
 *                  </DataTable.Row>
 *              );
 *          })
 *      }
 *
 * </DataTable>
 * ```
 * ### Show search field
 *
 * ![DataTable](manual/asset/dataTable/DataTable_4.png)
 * ```
 * <DataTable searchable>
 *      ...
 * </DataTable>
 * ```
 */
export default class DataTable extends Component {
    /**
     * Data row, see {@link TableRow}
     */
    static Row = TableRow;

    /**
     * Header column, see {@link TableColumn}
     */
    static Column = TableColumn;

    /**
     * Data column, see {@link TableDataCell}
     */
    static Data = TableDataCell;

    /**
     * Table action, see {@link TableAction}
     */
    static Action = TableAction;

    /**
     * Table filter, see {@link TableFilter}
     */
    static Filter = TableFilter;

    /**
     * Expandable row, see {@link TableRowExpandable}
     */
    static RowExpandable = TableRowExpandable;

    /**
     * Expandable data, see {@link TableDataExpandable}
     */
    static DataExpandable = TableDataExpandable;

    constructor(props, context) {
        super(props, context);

        this.paginationRef = React.createRef();

        this.state = {
            sortColumn: props.sortColumn,
            sortAscending: props.sortAscending,
            searchText: '',
            searching: false
        };

        this.debouncedSearch = _.debounce(
            () => {
                this.paginationRef.current.reset(() => {
                    return Promise.resolve(this._fetchData()).then(() => this.setState({ searching: false }));
                });
            },
            300,
            { maxWait: 2000 }
        );
    }

    /**
     * @property {object[]} children - table content
     * @property {Function} [fetchData] - used to fetch table data
     * @property {number} [totalSize=-1] - total number of rows in table, if not specified pagination will not be set. It is used to calculate pagination pages.
     * @property {Function} [fetchSize=-1] - if total number is unknown size of fetched data can be provided.
     * Pagination pages will be added dynamically until fetchSize is not equal to page size
     * @property {number} [pageSize=0] - number of displayed rows on page
     * @property {string} [sortColumn=] - column name used for data sorting
     * @property {string} [sortAscending=true] - true for ascending sort, false for descending sort
     * @property {boolean} [searchable=false] - if true filtering and searching input to be added
     * @property {boolean} [selectable=false] - if true row can be selected and highlighted
     * @property {string} [className=] - name of the style class to be added
     * @property {boolean} [noDataAvailable=false] - if true no data available message is shown
     * @property {number} [sizeMultiplier=5] - param related to pagination.
     * List of page sizes is generated as multiplication of basic fixed values [1, 2, 3, 5, 10] by this param
     */
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
        sizeMultiplier: PropTypes.number,
        noDataMessage: PropTypes.string
    };

    static defaultProps = {
        fetchData: () => Promise.resolve(),
        totalSize: -1,
        fetchSize: -1,
        pageSize: 0,
        sortColumn: '',
        sortAscending: true,
        searchable: false,
        selectable: false,
        className: '',
        noDataAvailable: false,
        sizeMultiplier: 5,
        noDataMessage: 'No data available'
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
            sortColumn: name => this._sortColumn(name)
        };
    }

    _sortColumn(name) {
        let ascending = this.state.sortAscending;

        if (this.state.sortColumn === name) {
            ascending = !ascending;
        } else {
            ascending = true;
        }

        const fetchData = { sortColumn: name, sortAscending: ascending, currentPage: 1 };
        this.setState(fetchData, () => {
            this.paginationRef.current.reset(this._fetchData.bind(this));
        });
    }

    componentDidUpdate(prevProps) {
        const changedProps = {};
        if (prevProps.sortColumn !== this.props.sortColumn) {
            changedProps.sortColumn = this.props.sortColumn;
        }
        if (prevProps.sortAscending !== this.props.sortAscending) {
            changedProps.sortAscending = this.props.sortAscending;
        }

        if (!_.isEmpty(changedProps)) {
            this.setState(changedProps);
        }
    }

    _fetchData() {
        return this.props.fetchData({
            gridParams: {
                _search: this.state.searchText,
                currentPage: this.paginationRef.current.state.currentPage,
                pageSize: this.paginationRef.current.state.pageSize,
                sortColumn: this.state.sortColumn,
                sortAscending: this.state.sortAscending
            }
        });
    }

    render() {
        const headerColumns = [];
        const bodyRows = [];
        let gridAction = null;
        const gridFilters = [];

        const showCols = [];
        React.Children.forEach(this.props.children, function(child) {
            if (child) {
                if (child.type === TableColumn) {
                    showCols.push(child.props.show);
                    headerColumns.push(child);
                } else if (child.type === TableRow) {
                    bodyRows.push(React.cloneElement(child, { showCols }));
                } else if (child.type === TableRowExpandable) {
                    const expandableContent = [];
                    React.Children.forEach(child.props.children, function(expChild) {
                        if (expChild) {
                            if (expChild.type === TableRow) {
                                bodyRows.push(React.cloneElement(expChild, { showCols }));
                            } else if (expChild.type === TableDataExpandable && child.props.expanded) {
                                expandableContent.push(
                                    React.cloneElement(expChild, { numberOfColumns: showCols.length })
                                );
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
                {(this.props.searchable || !_.isEmpty(gridFilters) || gridAction) && (
                    <Form size="small" as="div">
                        <Form.Group inline>
                            {this.props.searchable && (
                                <TableSearch
                                    search={this.state.searchText}
                                    searching={this.state.searching}
                                    onSearch={searchText =>
                                        this.setState({ searchText, searching: true }, this.debouncedSearch)
                                    }
                                />
                            )}
                            {gridFilters}
                            {gridAction}
                        </Form.Group>
                    </Form>
                )}

                <Pagination
                    totalSize={this.props.totalSize}
                    pageSize={this.props.pageSize}
                    sizeMultiplier={this.props.sizeMultiplier}
                    fetchSize={this.props.fetchSize}
                    fetchData={this._fetchData.bind(this)}
                    ref={this.paginationRef}
                >
                    <table
                        className={`ui very compact table sortable ${this.props.selectable ? 'selectable' : ''} ${
                            this.props.className
                        }`}
                        cellSpacing="0"
                        cellPadding="0"
                    >
                        <thead>
                            <tr>{headerColumns}</tr>
                        </thead>
                        {this.props.noDataAvailable ||
                        (this.props.totalSize <= 0 &&
                            this.props.fetchSize <= 0 &&
                            (this.props.totalSize === 0 || this.props.fetchSize === 0)) ? (
                            <tbody>
                                <tr className="noDataRow">
                                    <td colSpan={headerColumns.length} className="center aligned">
                                        {this.props.fetchSize === 0 &&
                                        this.paginationRef.current &&
                                        this.paginationRef.current.state.currentPage > 1 ? (
                                            <span>No more data available</span>
                                        ) : (
                                            <span>{this.props.noDataMessage}</span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>{bodyRows}</tbody>
                        )}
                    </table>
                </Pagination>
            </div>
        );
    }
}
