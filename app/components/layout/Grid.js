/**
 * Created by kinneretzin on 13/12/2016.
 */

import React, { Component, PropTypes } from 'react';
import {WidthProvider, Responsive} from 'react-grid-layout';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class Grid extends Component {
      
    static propTypes = {
        onGridDataChange: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired
    };

    _saveChangedItems(layout) {
        this.props.isEditMode && 
            _.each(layout,(item)=>{
                this.props.onGridDataChange(item.i,{
                    height: item.h,
                    width: item.w,
                    x: item.x,
                    y: item.y
                });
            });
    }
    
    _itemAdded(){}
    _itemRemoved(){}
    
    createElement(el){

        // clone element to initialize events ( no need for it now )
        el = React.cloneElement(el, {
            onItemAdded: this._itemAdded.bind(this),
            onItemRemoved: this._itemRemoved.bind(this)
        })

        // wrap element with div (needed for renderer library)
        el = (
            <div 
                key={el.props.id}
                data-grid={{
                    x: el.props.x || 0,
                    y: el.props.y || 0, 
                    w: el.props.width || 10,
                    h: el.props.height || 5
                }}
            >
                {el}
            </div>
        );

        return el;
    }

    render() {
        return (
            <div>
                <div></div>
                <ResponsiveReactGridLayout
                    className={`layout ${this.props.isEditMode && 'isEditMode'}`}
                    breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                    cols={{lg: 10, md: 10, sm: 6, xs: 4, xxs: 2}} rowHeight={10}
                    onLayoutChange={this._saveChangedItems.bind(this)}
                    isDraggable={this.props.isEditMode}
                    isResizable={this.props.isEditMode}
                >
                    {_.map(this.props.children, this.createElement.bind(this))}
                </ResponsiveReactGridLayout>
            </div>
        );
    }
}