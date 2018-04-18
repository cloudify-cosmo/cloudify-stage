/**
 * Created by kinneretzin on 13/12/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { areComponentsEqual } from 'react-hot-loader';
import GridItem from './GridItem';
import RGL, { WidthProvider } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL);

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
        if (el.type && !areComponentsEqual(el.type, GridItem)) {
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
            <ReactGridLayout
                className={['layout', this.props.isEditMode && 'isEditMode'].join(' ')}
                cols={12} rowHeight={10}
                onLayoutChange={this._saveChangedItems.bind(this)}
                isDraggable={this.props.isEditMode}
                isResizable={this.props.isEditMode}
                useCSSTransforms={false}
                >
                {_.map(this.props.children, this.processGridItem.bind(this))}
            </ReactGridLayout>
        );
    }
}