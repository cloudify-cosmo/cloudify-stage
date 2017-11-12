/**
 * Created by kinneretzin on 13/12/2016.
 */

import React, { Component, PropTypes } from 'react';
import GridItem from './GridItem';

export default class Grid extends Component {
    static propTypes = {
        onGridDataChange: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired
    };

    componentDidMount() {
        $(this.refs.grid).gridstack({
            cellHeight: 10,
            verticalMargin: 10,
            animate: true,
            disableResize: !this.props.isEditMode,
            disableDrag: !this.props.isEditMode,
            draggable: {
                scroll: true
            }
        });

        $(this.refs.grid).off('change').on('change', (event, items)=> {
            this._saveChangedItems(items);
        });

        this.itemIds = [];
        _.each(this.props.children,(child)=>{
            if (child.type && child.type === GridItem) {
                this.itemIds.push(child.props.id);
            }
        });
    }

    _saveChangedItems(items) {
        // Run update method for each item that was changed
        _.each(items,(item)=>{
            var itemId = $(item.el).attr('id');
            this.props.onGridDataChange(itemId,{
                height: item.height,
                width: item.width,
                x: item.x,
                y: item.y
            });
        });
    }

    componentWillUnmount() {
        $(this.refs.grid).off('change');
    }

    toggleWidgetListEditMode(isEditMode) {
        var gridStack = $(this.refs.grid).data('gridstack');
        if (isEditMode) {
            gridStack.enable();
        }
        else {
            gridStack.disable();
        }
    }

    componentDidUpdate() {
        this.toggleWidgetListEditMode(this.props.isEditMode);
    }

    _itemAdded (itemId) {
        if (this.itemIds && _.indexOf(this.itemIds,itemId) < 0) {
            let el = $(this.refs.grid).find('#'+itemId);
            if (el.length > 0) {
                el = el[0];
                var gridStack = $(this.refs.grid).data('gridstack');
                gridStack.makeWidget(el);
            }
            this.itemIds.push(itemId);
        }
    }

    _itemRemoved(itemId) {
        if (this.itemIds && _.indexOf(this.itemIds,itemId) >= 0) {
            let el = $(this.refs.grid).find('#'+itemId);
            if (el.length > 0) {
                el = el[0];
                var gridStack = $(this.refs.grid).data('gridstack');
                gridStack.removeWidget(el, false);
            }
            _.pull(this.itemIds,itemId);
        }
    }

    render() {

        var gridItems = [];
        _.each(this.props.children,(child)=>{
            if (child.type && child.type === GridItem) {
                var gridItem = React.cloneElement(child,{onItemAdded: this._itemAdded.bind(this),onItemRemoved: this._itemRemoved.bind(this)})
                gridItems.push(gridItem);
            } else {
                console.warn('Found a grid child that is not grid item. Ignoring this child')
            }
        });

        return (
            <div className="grid-stack" ref='grid'>
                {gridItems}
            </div>
        );
    }
}