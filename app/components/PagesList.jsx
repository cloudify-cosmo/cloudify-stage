/**
 * Created by kinneretzin on 01/09/2016.
 */

import _ from 'lodash';
import 'jquery-ui/ui/widgets/sortable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import i18n from 'i18next';
import AddPageButton from '../containers/AddPageButton';
import { Confirm, Icon, Menu } from './basic';

export default class PagesList extends Component {
    constructor(props) {
        super(props);

        this.pagesRef = React.createRef();
        this.state = {};
    }

    componentDidMount() {
        const { onPageReorder } = this.props;
        $(this.pagesRef.current).sortable({
            placeholder: 'ui-sortable-placeholder',
            helper: 'clone',
            forcePlaceholderSize: true,
            start: (event, ui) => {
                this.pageIndex = ui.item.index();
            },
            update: (event, ui) => onPageReorder(this.pageIndex, ui.item.index())
        });

        this.enableReorderInEditMode();
    }

    componentDidUpdate(/* prevProps, prevState */) {
        this.enableReorderInEditMode();
    }

    enableReorderInEditMode() {
        const { isEditMode } = this.props;
        if (isEditMode) {
            if ($(this.pagesRef.current).sortable('option', 'disabled')) {
                $(this.pagesRef.current).sortable('enable');
            }
        } else if (!$(this.pagesRef.current).sortable('option', 'disabled')) {
            $(this.pagesRef.current).sortable('disable');
        }
    }

    render() {
        const { isEditMode, onPageRemoved, onPageSelected, pages, selected } = this.props;
        const { pageToRemove } = this.state;
        let pageCount = 0;
        pages.forEach(page => {
            if (!page.isDrillDown) {
                pageCount += 1;
            }
        });

        return (
            <>
                <div className="pages" ref={this.pagesRef}>
                    {_.filter(pages, p => !p.isDrillDown).map(
                        page => (
                            <Menu.Item
                                as="div"
                                link
                                key={page.id}
                                active={selected === page.id}
                                className={`pageMenuItem ${page.id}PageMenuItem`}
                                onClick={event => {
                                    event.stopPropagation();
                                    onPageSelected(page);
                                }}
                            >
                                {page.name}
                                {isEditMode && pageCount > 1 ? (
                                    <Icon
                                        name="remove"
                                        size="small"
                                        className="pageRemoveButton"
                                        onClick={event => {
                                            event.stopPropagation();
                                            if (_.isEmpty(page.tabs) && _.isEmpty(page.widgets)) onPageRemoved(page);
                                            else this.setState({ pageToRemove: page });
                                        }}
                                    />
                                ) : (
                                    ''
                                )}
                            </Menu.Item>
                        ),
                        this
                    )}
                </div>
                {isEditMode && (
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <AddPageButton />
                    </div>
                )}
                <Confirm
                    open={!!pageToRemove}
                    onCancel={() => this.setState({ pageToRemove: null })}
                    onConfirm={() => {
                        onPageRemoved(pageToRemove);
                        this.setState({ pageToRemove: null });
                    }}
                    header={i18n.t(
                        'editMode.pageRemovalModal.header',
                        `Are you sure you want to remove page {{pageName}}?`,
                        { pageName: _.get(pageToRemove, 'name') }
                    )}
                    content={i18n.t(
                        'editMode.pageRemovalModal.message',
                        'All widgets and tabs present in this page will be removed as well'
                    )}
                />
            </>
        );
    }
}

PagesList.propTypes = {
    onPageSelected: PropTypes.func.isRequired,
    onPageRemoved: PropTypes.func.isRequired,
    onPageReorder: PropTypes.func.isRequired,
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            isDrillDown: PropTypes.bool,
            tabs: PropTypes.arrayOf(PropTypes.shape({})),
            widgets: PropTypes.arrayOf(PropTypes.shape({}))
        })
    ).isRequired,
    selected: PropTypes.string,
    isEditMode: PropTypes.bool.isRequired
};

PagesList.defaultProps = {
    selected: ''
};
