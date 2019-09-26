/**
 * Created by pawelposel on 17/11/2016.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form, Icon, Message } from 'semantic-ui-react';
import TableSearch from '../dataTable/TableSearch';
import Pagination from '../pagination/Pagination';
import SegmentAction from './SegmentAction';
import SegmentItem from './SegmentItem';

/**
 * DataSegment component enables fetching data using predefined function and showing segmented data in a simple manner.
 *
 * It delivers alternative way of presenting fetched data to {@link DataTable}.
 *
 * ## Access
 * `Stage.Basic.DataSegment`
 *
 * ## Features
 * - data pagination
 * - selectable segments
 *
 * ## Usage
 *
 * ## Simple example
 * ![DataSegment_0](manual/asset/dataSegment/DataSegment_0.png)
 * ```
 * <DataSegment>
 *
 *     <DataSegment.Action>
 *         <Button icon="rocket" />
 *     </DataSegment.Action>
 *
 *     <DataSegment.Item>
 *         <h2>SegmentItem 1</h2>
 *     </DataSegment.Item>
 *
 *     <DataSegment.Item>
 *         <h2>SegmentItem 2</h2>
 *     </DataSegment.Item>
 *
 *     <DataSegment.Item>
 *         <h2>SegmentItem 3</h2>
 *     </DataSegment.Item>
 *
 *     <DataSegment.Item>
 *         <h2>SegmentItem 4</h2>
 *     </DataSegment.Item>
 *
 * </DataSegment>
 * ```
 *
 * ## Deployments list example
 * ![DataSegment_1](manual/asset/dataSegment/DataSegment_1.png)
 *
 * ```
 * <DataSegment totalSize={this.props.data.total}
 *              pageSize={this.props.widget.configuration.pageSize}
 *              fetchData={this.props.fetchData}>
 * {
 *      this.props.data.items.map((item) => {
 *          return (
 *              <DataSegment.Item key={item.id} selected={item.isSelected} className={item.id}
 *                            onClick={()=>this.props.onSelectDeployment(item)}>
 *                  <div className="ui grid">
 *                      <div className="three wide center aligned column rightDivider">
 *                          <h3 className="ui icon header verticalCenter">{item.id}</h3>
 *                          <ResourceVisibility visibility={item.visibility} className="rightFloated"/>
 *                      </div>
 *                      <div className="two wide column">
 *                          <h5 className="ui icon header">Blueprint</h5>
 *                          <p>{item.blueprint_id}</p>
 *                      </div>
 *                      <div className="two wide column">
 *                          <h5 className="ui icon header">Created</h5>
 *                          <p>{item.created_at}</p>
 *                      </div>
 *                      <div className="two wide column">
 *                          <h5 className="ui icon header">Updated</h5>
 *                          <p>{item.updated_at}</p>
 *                      </div>
 *                      <div className="two wide column">
 *                          <h5 className="ui icon header">Creator</h5>
 *                          <p>{item.created_by}</p>
 *                      </div>
 *                      <div className="four wide column">
 *                          <h5 className="ui icon header">Nodes ({item.nodeSize})</h5>
 *                          <div className="ui four column grid">
 *                              <div className="column center aligned">
 *                                  <NodeState icon="checkmark" title="running" state="started" color="green"
 *                                             value={item.nodeStates.started}/>
 *                              </div>
 *                              <div className="column center aligned">
 *                                  <NodeState icon="spinner" title="in progress" state="uninitialized or created" color="yellow"
 *                                             value={_.add(item.nodeStates.uninitialized, item.nodeStates.created)}/>
 *                              </div>
 *                              <div className="column center aligned">
 *                                  <NodeState icon="exclamation" title="warning" state="undefined" color="orange"
 *                                             value={0}/>
 *                              </div>
 *                              <div className="column center aligned">
 *                                  <NodeState icon="remove" title="error" state="deleted or stopped" color="red"
 *                                             value={_.add(item.nodeStates.deleted, item.nodeStates.stopped)}/>
 *                              </div>
 *                          </div>
 *                      </div>
 *
 *                      <div className="column action">
 *                          {
 *                              _.isEmpty(item.executions)
 *                              ?
 *                              <MenuAction item={item} onSelectAction={this.props.onMenuAction}/>
 *                              :
 *                              <ActiveExecutionStatus item={item.executions[0]} onCancelExecution={this.props.onCancelExecution}/>
 *                          }
 *                      </div>
 *                  </div>
 *              </DataSegment.Item>
 *         );
 *     })
 * }
 * </DataSegment>
 * ```
 */
export default class DataSegment extends Component {
    /**
     * Segment item, see {@link SegmentItem}
     */
    static Item = SegmentItem;

    /**
     * Segment action, see {@link SegmentAction}
     */
    static Action = SegmentAction;

    constructor(props, context) {
        super(props, context);

        this.paginationRef = React.createRef();

        this.state = {
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
     * propTypes
     *
     * @property {object[]} children - primary content
     * @property {Function} [fetchData] - used to fetch data
     * @property {number} [totalSize=-1] - total number of data segments, if not specified pagination will not be set. It is used to calculate pagination pages.
     * @property {Function} [fetchSize=-1] - if total number is unknown size of fetched data can be provided.
     * Pagination pages will be added dynamically until fetchSize is not equal to page size
     * @property {number} [pageSize=0] - number of displayed rows on page
     * @property {number} [sizeMultiplier=3] - param related to pagination.
     * List of page sizes is generated as multiplication of basic fixed values [1, 2, 3, 5, 10] by this param
     * @property {string} [className=''] - CSS classname
     * @property {boolean} [searchable=false] - if true filtering and searching input to be added
     */
    static propTypes = {
        children: PropTypes.any.isRequired,
        fetchData: PropTypes.func.isRequired,
        totalSize: PropTypes.number,
        fetchSize: PropTypes.number,
        pageSize: PropTypes.number,
        className: PropTypes.string,
        sizeMultiplier: PropTypes.number,
        searchable: PropTypes.bool,
        noDataMessage: PropTypes.string
    };

    static defaultProps = {
        className: '',
        fetchData: () => {},
        totalSize: -1,
        fetchSize: -1,
        pageSize: 0,
        sizeMultiplier: 3,
        searchable: false,
        noDataMessage: 'No data available'
    };

    _fetchData() {
        return this.props.fetchData({
            gridParams: {
                _search: this.state.searchText,
                currentPage: this.paginationRef.current.state.currentPage,
                pageSize: this.paginationRef.current.state.pageSize
            }
        });
    }

    render() {
        let segmentAction = null;
        const children = [];

        React.Children.forEach(this.props.children, function(child) {
            if (child && child.type) {
                if (child.type === SegmentAction) {
                    segmentAction = child;
                } else {
                    children.push(child);
                }
            }
        });

        return (
            <div className={`segmentList ${this.props.className}`}>
                {(segmentAction || this.props.searchable) && (
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
                            {segmentAction}
                        </Form.Group>
                    </Form>
                )}

                <Pagination
                    totalSize={this.props.totalSize}
                    pageSize={this.props.pageSize}
                    sizeMultiplier={this.props.sizeMultiplier}
                    fetchData={this._fetchData.bind(this)}
                    fetchSize={this.props.fetchSize}
                    ref={this.paginationRef}
                >
                    {this.props.totalSize <= 0 &&
                    this.props.fetchSize <= 0 &&
                    (this.props.totalSize === 0 || this.props.fetchSize === 0) ? (
                        <Message icon>
                            <Icon name="ban" />
                            {this.props.fetchSize === 0 &&
                            this.paginationRef.current &&
                            this.paginationRef.current.state.currentPage > 1 ? (
                                <span>No more data available</span>
                            ) : (
                                <span>{this.props.noDataMessage}</span>
                            )}
                        </Message>
                    ) : (
                        children
                    )}
                </Pagination>
            </div>
        );
    }
}
