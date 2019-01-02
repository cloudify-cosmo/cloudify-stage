/**
 * Created by kinneretzin on 01/09/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import 'jquery-ui/ui/widgets/sortable';

export default class PagesList extends Component {
    constructor(props) {
        super(props);

        this.pagesRef = React.createRef();
    }
    
    static propTypes = {
        onPageSelected: PropTypes.func.isRequired,
        onPageRemoved: PropTypes.func.isRequired,
        onPageReorder: PropTypes.func.isRequired,
        onSidebarClose : PropTypes.func.isRequired,
        pages: PropTypes.array.isRequired,
        selected: PropTypes.string,
        isEditMode : PropTypes.bool.isRequired
    };

    componentDidMount() {
        $(this.pagesRef.current).sortable({
            placeholder: 'ui-sortable-placeholder',
            helper: 'clone',
            forcePlaceholderSize: true,
            start: (event, ui)=>this.pageIndex = ui.item.index(),
            update: (event, ui)=>this.props.onPageReorder(this.pageIndex, ui.item.index())
        });

        this._enableReorderInEditMode();
    }

    componentDidUpdate(prevProps, prevState) {
        this._enableReorderInEditMode();
    }

    _enableReorderInEditMode() {
        if (this.props.isEditMode) {
            if ($(this.pagesRef.current).sortable( 'option', 'disabled' )) {
                $(this.pagesRef.current).sortable('enable');
            }
        } else {
            if (!$(this.pagesRef.current).sortable( 'option', 'disabled' )) {
                $(this.pagesRef.current).sortable('disable');
            }
        }
    }

    render() {
        var pageCount = 0;
        this.props.pages.map(p => {
           if (!p.isDrillDown) {
               pageCount++;
           }
        });

        return (
            <div className="pages" ref={this.pagesRef}>
                {
                    _.filter(this.props.pages, (p)=>{return !p.isDrillDown}).map(function(page){
                        return <div 
                                key={page.id} className={`item link pageMenuItem ${page.id}PageMenuItem ${this.props.selected === page.id ? 'active' : ''}`}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    this.props.onPageSelected(page);
                                    this.props.onSidebarClose();
                                }}>
                        {page.name}
                        {
                            this.props.isEditMode && pageCount > 1 ?
                                <i className="remove link icon small pageRemoveButton" onClick={(event) => {event.stopPropagation(); this.props.onPageRemoved(page)}}/>
                            :
                            ''
                        }
                        </div>
                    },this)
                }
            </div>
        );
    }
}

