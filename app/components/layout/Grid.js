/**
 * Created by kinneretzin on 13/12/2016.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import GridItem from './GridItem';

const ReactGridLayout = WidthProvider(Responsive);

export default class Grid extends Component {
    static propTypes = {
        onGridDataChange: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired
    };

    saveChangedItems(layout) {
        this.props.isEditMode &&
            _.each(layout, item => {
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
        return React.createElement(
            'div',
            {
                key: el.props.id,
                className: [el.props.className, el.props.maximized && 'maximize'].join(' '),
                'data-grid': {
                    x: el.props.x || 0,
                    y: el.props.y || 0,
                    w: el.props.width || 10,
                    h: el.props.height || 5
                }
            },
            el
        );
    }

    render() {
        return (
            <ReactGridLayout
                className={['layout', this.props.isEditMode && 'isEditMode'].join(' ')}
                breakpoints={{ lg: 1000, md: 800, sm: 640, xs: 320, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 2 }}
                rowHeight={10}
                onLayoutChange={this.saveChangedItems.bind(this)}
                isDraggable={this.props.isEditMode}
                isResizable={this.props.isEditMode}
                useCSSTransforms={false}
            >
                {_.map(this.props.children, this.processGridItem.bind(this))}
            </ReactGridLayout>
        );
    }
}
