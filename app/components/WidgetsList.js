/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';

import Widget from '../containers/Widget';

export default class WidgetsList extends Component {
    static isEditMode = false;

    static propTypes = {
        pageId: PropTypes.string.isRequired,
        widgets: PropTypes.array.isRequired,
        onWidgetsGridDataChange: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired
    };

    componentDidMount () {
        $('.grid-stack').gridstack({
            cellHeight : 80,
            verticalMargin: 10
        });

        $('.grid-stack').off('change').on('change', (event, items)=> {
            this._saveChangedItems(items);
        });

    }

    _saveChangedItems(items) {
        if (items) {
            items.forEach(item=>{
                var widgetId = $(item.el).attr('id');
                console.log('Widget data changed for id: '+widgetId,{
                    height: item.height,
                    width: item.width,
                    x: item.x,
                    y: item.y
                })

                this.props.onWidgetsGridDataChange(this.props.pageId,widgetId,{
                    height: item.height,
                    width: item.width,
                    x: item.x,
                    y: item.y
                });

            },this);
        }

        //Re add style on grid-stack-item which is being removed during widgets relocating
        _.each(this.props.widgets,(w)=>{
            if (w.plugin && w.plugin.zIndex) {
                $(`#${w.id}`).css("z-index", w.plugin.zIndex);
            }
        });
    }

    componentWillUnmount() {
        $('.grid-stack').off('change');
    }

    toggleWidgetListEditMode(isEditMode) {
        var gridStack = $('.grid-stack').data('gridstack');
        if (isEditMode)
        {
            gridStack.enable();
        }
        else
        {
            gridStack.disable();
        }

    }

    componentWillUpdate(nextProps) {
        $('.grid-stack').off('change');

        var gridStack = $('.grid-stack').data('gridstack');
        // Remove widgets if needed
        const toRemove = _.differenceWith(this.props.widgets, nextProps.widgets, (a, b) => {
            return (a.id === b.id)
        });
        toRemove.forEach(function(r){
            const el = document.getElementById(r.id)
            gridStack.removeWidget(el,false);
        });

        //$('.widget').flip();

    }

    componentDidUpdate(prevProps, prevState) {

        var gridStack = $('.grid-stack').data('gridstack');

        const toAdd = _.differenceWith(this.props.widgets,prevProps.widgets, (a, b) => {
            return (a.id === b.id)
        });

        toAdd.forEach(function(w){
            const el = document.getElementById(w.id)
            gridStack.makeWidget(el);
        });

        $('.grid-stack').off('change').on('change', (event, items)=> {
            this._saveChangedItems(items);
        });

        this.toggleWidgetListEditMode(this.props.isEditMode);
    }

    render() {
        return (
            <div className="grid-stack">

                {/* temp example widgets */}
                {
                    this.props.widgets.map(function(widget){
                        return <Widget key={widget.id} widget={widget} pageId={this.props.pageId}></Widget>;
                    },this)
                }

            </div>
        );
    }
}

