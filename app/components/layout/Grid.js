/**
 * Created by kinneretzin on 13/12/2016.
 */

import React, { Component, PropTypes } from 'react';
import GridItem from './GridItem';
import { WidthProvider, Responsive } from 'react-grid-layout';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class Grid extends Component {

    static propTypes = {
        onGridDataChange: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired
    };

    _saveChangedItems(layout) {
        this.props.isEditMode &&
            _.each(layout, (item) => {
                this.props.onGridDataChange(item.i, {
                    height: item.h,
                    width: item.w,
                    x: item.x,
                    y: item.y
                });
            });
    }

    processGridItem(el) {
        if (el.type && el.type !== GridItem) {
            return [];
        }
        return React.createElement('div', {
            key: el.props.id,
            className: [
                el.props.className,
                el.props.maximized && 'maximize'
            ].join(' '),
            'data-grid': {
                x: el.props.x || 0,
                y: el.props.y || 0,
                w: el.props.width || 10,
                h: el.props.height || 5
            }
        }, el)
    }

    render() {
        return (
            <ResponsiveReactGridLayout
                className={['layout', this.props.isEditMode && 'isEditMode'].join(' ')}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} rowHeight={10}
                onLayoutChange={this._saveChangedItems.bind(this)}
                isDraggable={this.props.isEditMode}
                isResizable={this.props.isEditMode}
                >
                {_.map(this.props.children, this.processGridItem.bind(this))}
            </ResponsiveReactGridLayout>
        );
    }
}