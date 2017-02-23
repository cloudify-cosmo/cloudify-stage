/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';
import 'jquery-ui/ui/widgets/sortable';

export default class PagesList extends Component {

    static propTypes = {
        onPageSelected: PropTypes.func.isRequired,
        onPageRemoved: PropTypes.func.isRequired,
        onPageReorder: PropTypes.func.isRequired,
        pages: PropTypes.array.isRequired,
        selected: PropTypes.string,
        isEditMode : PropTypes.bool.isRequired
    };

    componentDidMount() {
        $(this.refs.pages).sortable({
            placeholder: "ui-sortable-placeholder",
            helper: "clone",
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
            if ($(this.refs.pages).sortable( "option", "disabled" )) {
                $(this.refs.pages).sortable("enable");
            }
        } else {
            if (!$(this.refs.pages).sortable( "option", "disabled" )) {
                $(this.refs.pages).sortable("disable");
            }
        }
    }

    render() {
        return (
            <div className="pages" ref="pages">
                {
                    _.filter(this.props.pages, (p)=>{return !p.isDrillDown}).map(function(page){
                        return <div key={page.id} className={'item ' + (this.props.selected === page.id ? 'active' : '') + ' pageMenuItem'} onClick={()=>{this.props.onPageSelected(page);} }>
                        {page.name}
                        {
                            this.props.isEditMode && page.id != "0" ?
                                <i className="remove link icon small pageRemoveButton" onClick={()=>this.props.onPageRemoved(page)}/>
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

