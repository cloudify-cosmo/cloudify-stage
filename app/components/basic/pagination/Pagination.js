/**
 * Created by pawelposel on 17/11/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import PaginationInfo from './PaginationInfo';
import TotalSizePaginator from './TotalSizePaginator';
import FetchSizePaginator from './FetchSizePaginator';
import { Icon, Message, Popup } from '../index';

export default class Pagination extends Component {
    static PAGE_SIZE_LIST = PaginationInfo.pageSizes;

    constructor(props, context) {
        super(props, context);

        this.state = {
            pageSize: props.pageSize,
            currentPage: 1,
            showWarningPopup: false
        };

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

    _changePageSize(size) {
        const minPageSize = 1;
        const maxPageSize = 500;
        const popupShowTimeout = 3000;
        let pageSize = parseInt(size);
        let showWarningPopup = false;

        if (_.isNaN(pageSize) || pageSize < minPageSize || pageSize > maxPageSize) {
            pageSize = Pagination.PAGE_SIZE_LIST(this.props.sizeMultiplier)[0];
            showWarningPopup = true;
        }

        this.setState({ pageSize, currentPage: 1, showWarningPopup }, () => {
            if (showWarningPopup) {
                setTimeout(() => this.setState({ showWarningPopup: false }), popupShowTimeout);
            }
            return this.props.fetchData();
        });
    }

    _changePage(page, pageSize) {
        this.setState({ currentPage: page, pageSize: pageSize || this.state.pageSize }, () => {
            this.props.fetchData();
        });
    }

    reset(callback) {
        this.setState({ currentPage: 1 }, callback);
    }

    componentDidUpdate(prevProps) {
        const changedProps = {};

        if (prevProps.pageSize !== this.props.pageSize) {
            changedProps.pageSize = this.props.pageSize;
        }

        if (this.props.totalSize >= 0 && this.state.currentPage !== 1) {
            const pageCount = Math.ceil(this.props.totalSize / this.props.pageSize);
            if (this.state.currentPage > pageCount) {
                changedProps.currentPage = 1;
            }
        }

        if (!_.isEmpty(changedProps)) {
            this._changePage(changedProps.currentPage || this.state.currentPage, changedProps.pageSize);
        }
    }

    render() {
        return (
            <div>
                {this.props.children}

                {(this.props.totalSize > Pagination.PAGE_SIZE_LIST(this.props.sizeMultiplier)[0] ||
                    this.props.fetchSize > 0 ||
                    this.state.currentPage > 1) && (
                    <div className="ui two column grid gridPagination">
                        <div className="column">
                            <Popup open={this.state.showWarningPopup} wide="very">
                                <Popup.Trigger>
                                    <PaginationInfo
                                        currentPage={this.state.currentPage}
                                        pageSize={this.state.pageSize}
                                        totalSize={this.props.totalSize}
                                        fetchSize={this.props.fetchSize}
                                        onPageSizeChange={this._changePageSize.bind(this)}
                                        sizeMultiplier={this.props.sizeMultiplier}
                                    />
                                </Popup.Trigger>
                                <Popup.Content>
                                    <Message warning>
                                        <Icon name="warning sign" />
                                        Only integer values between 1 and 500 are allowed.
                                    </Message>
                                </Popup.Content>
                            </Popup>
                        </div>
                        <div className="right aligned column">
                            {this.props.totalSize > 0 ? (
                                <TotalSizePaginator
                                    currentPage={this.state.currentPage}
                                    pageSize={this.state.pageSize}
                                    totalSize={this.props.totalSize}
                                    onPageChange={this._changePage.bind(this)}
                                />
                            ) : (
                                <FetchSizePaginator
                                    currentPage={this.state.currentPage}
                                    pageSize={this.state.pageSize}
                                    fetchSize={this.props.fetchSize}
                                    onPageChange={this._changePage.bind(this)}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
