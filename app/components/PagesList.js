/**
 * Created by kinneretzin on 01/09/2016.
 */

import 'jquery-ui/ui/widgets/sortable';
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import AddPageButton from '../containers/AddPageButton';
import { Message } from './basic';

export default class PagesList extends Component {
    constructor(props) {
        super(props);

        this.pagesRef = React.createRef();
    }

    static propTypes = {
        onPageSelected: PropTypes.func.isRequired,
        onPageRemoved: PropTypes.func.isRequired,
        onPageReorder: PropTypes.func.isRequired,
        onSidebarClose: PropTypes.func.isRequired,
        pages: PropTypes.array.isRequired,
        selected: PropTypes.string,
        isEditMode: PropTypes.bool.isRequired
    };

    componentDidMount() {
        const { onPageReorder } = this.props;
        $(this.pagesRef.current).sortable({
            placeholder: 'ui-sortable-placeholder',
            helper: 'clone',
            forcePlaceholderSize: true,
            start: (event, ui) => (this.pageIndex = ui.item.index()),
            update: (event, ui) => onPageReorder(this.pageIndex, ui.item.index())
        });

        this.enableReorderInEditMode();
    }

    componentDidUpdate(prevProps, prevState) {
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
        let pageCount = 0;
        pages.map(p => {
            if (!p.isDrillDown) {
                pageCount++;
            }
        });

        return (
            <>
                <div className="pages" ref={this.pagesRef}>
                    {_.filter(pages, p => !p.isDrillDown).map(
                        page => (
                            <div
                                key={page.id}
                                className={`item link pageMenuItem ${page.id}PageMenuItem ${
                                    selected === page.id ? 'active' : ''
                                }`}
                                onClick={event => {
                                    event.stopPropagation();
                                    onPageSelected(page);
                                }}
                            >
                                {page.name}
                                {isEditMode && pageCount > 1 ? (
                                    <i
                                        className="remove link icon small pageRemoveButton"
                                        onClick={event => {
                                            event.stopPropagation();
                                            onPageRemoved(page);
                                        }}
                                    />
                                ) : (
                                    ''
                                )}
                            </div>
                        ),
                        this
                    )}
                </div>
                {isEditMode && (
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <AddPageButton />
                    </div>
                )}
            </>
        );
    }
}
