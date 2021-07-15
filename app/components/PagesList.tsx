import _ from 'lodash';

import 'jquery-ui/ui/widgets/sortable';
import PropTypes from 'prop-types';
import React, { Component, RefObject } from 'react';
import i18n from 'i18next';
import AddPageButton from '../containers/AddPageButton';
import { Confirm, Icon, Menu } from './basic';
import Consts from '../utils/consts';

export interface Page {
    id: string;
    name: string;
    isDrillDown: boolean;
    tabs: any[];
    widgets: any[];
}

export interface PagesListProps {
    onPageSelected: (page: Page) => void;
    onPageRemoved: (page: Page) => void;
    onPageReorder: (index: number, newIndex: number) => void;
    pages: Page[];
    selected?: string;
    isEditMode: boolean;
}

export interface PagesListState {
    pageToRemove?: Page | null;
}
export default class PagesList extends Component<PagesListProps, PagesListState> {
    // eslint-disable-next-line react/static-property-placement
    static propTypes = {
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

    // NOTE: TypeScript need static defaultProps to mark those props as non-optional in `this.props`
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = {
        selected: ''
    };

    pagesRef: RefObject<HTMLDivElement>;

    constructor(props: PagesListProps) {
        super(props);

        this.pagesRef = React.createRef<HTMLDivElement>();
        this.state = {};
    }

    componentDidMount() {
        const { onPageReorder } = this.props;
        let pageIndex: number;

        // @ts-ignore until the application uses jQuery
        $(this.pagesRef.current).sortable({
            placeholder: 'ui-sortable-placeholder',
            helper: 'clone',
            forcePlaceholderSize: true,
            // @ts-ignore until the application uses jQuery
            start: (event, ui) => {
                pageIndex = ui.item.index();
            },
            // @ts-ignore until the application uses jQuery
            update: (event, ui) => onPageReorder(pageIndex, ui.item.index())
        });
        this.enableReorderInEditMode();
    }

    componentDidUpdate(/* prevProps, prevState */) {
        this.enableReorderInEditMode();
    }

    enableReorderInEditMode() {
        const { isEditMode } = this.props;
        if (isEditMode) {
            // @ts-ignore until the application uses jQuery
            if ($(this.pagesRef.current).sortable('option', 'disabled')) {
                // @ts-ignore until the application uses jQuery
                $(this.pagesRef.current).sortable('enable');
            }
            // @ts-ignore until the application uses jQuery
        } else if (!$(this.pagesRef.current).sortable('option', 'disabled')) {
            // @ts-ignore until the application uses jQuery
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
                                as="a"
                                link
                                key={page.id}
                                href={`${Consts.CONTEXT_PATH}/page/${page.id}`}
                                active={selected === page.id}
                                className={`pageMenuItem ${page.id}PageMenuItem`}
                                onClick={event => {
                                    event.preventDefault();
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
                                        onClick={(event: MouseEvent) => {
                                            event.preventDefault();
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
                        {/* @ts-ignore until the AddPageButton not fully migrated to ts */}
                        <AddPageButton />
                    </div>
                )}
                <Confirm
                    open={!!pageToRemove}
                    onCancel={() => this.setState({ pageToRemove: null })}
                    onConfirm={() => {
                        if (pageToRemove) {
                            onPageRemoved(pageToRemove);
                            this.setState({ pageToRemove: null });
                        }
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
