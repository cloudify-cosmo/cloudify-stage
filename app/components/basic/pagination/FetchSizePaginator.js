/**
 * Created by pawelposel on 17/11/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

const PAGER_POSITIONS = 4;

export default class FetchSizePaginator extends Component {
    static propTypes = {
        currentPage: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        fetchSize: PropTypes.number.isRequired,
        onPageChange: PropTypes.func.isRequired
    };

    render() {
        if (this.props.currentPage <= 1 && this.props.fetchSize < this.props.pageSize) {
            return null;
        }

        const prevPageDisabled = this.props.currentPage == 1;
        const nextPageDisabled = this.props.fetchSize < this.props.pageSize;

        let begin =
            this.props.currentPage <= PAGER_POSITIONS
                ? 1
                : Math.max(this.props.currentPage - Math.floor(PAGER_POSITIONS / 2), 1);
        if (
            this.props.currentPage > PAGER_POSITIONS &&
            this.props.currentPage > this.props.currentPage - Math.floor(PAGER_POSITIONS / 2)
        ) {
            begin = this.props.currentPage - PAGER_POSITIONS + 1;
        }

        const pagerElements = [];
        for (let i = begin; i <= this.props.currentPage; i++) {
            if (begin > 1 && this.props.currentPage > PAGER_POSITIONS && i == begin) {
                pagerElements.push(<Menu.Item key={i} content="1" onClick={() => this.props.onPageChange(1)} />);
                if (begin > 2) {
                    pagerElements.push(<Menu.Item key={i + 1} content="..." className="disabled" />);
                } else {
                    pagerElements.push(
                        <Menu.Item key={i + 1} content="2" onClick={() => this.props.onPageChange(2)} />
                    );
                }
            } else {
                (function(index, self) {
                    pagerElements.push(
                        <Menu.Item
                            key={index + 1}
                            active={self.props.currentPage == index}
                            content={index}
                            onClick={() => self.props.onPageChange(index)}
                        />
                    );
                })(i, this);
            }
        }

        return (
            <Menu pagination floated="right" size="small">
                <Menu.Item
                    icon="angle left"
                    link
                    className={prevPageDisabled ? 'disabled' : ''}
                    onClick={() => {
                        if (!prevPageDisabled) this.props.onPageChange(this.props.currentPage - 1);
                    }}
                />

                {pagerElements}

                <Menu.Item
                    icon="angle right"
                    link
                    className={nextPageDisabled ? 'disabled' : ''}
                    onClick={() => {
                        if (!nextPageDisabled) this.props.onPageChange(this.props.currentPage + 1);
                    }}
                />
            </Menu>
        );
    }
}
