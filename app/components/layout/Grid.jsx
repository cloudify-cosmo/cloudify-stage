/**
 * Created by kinneretzin on 13/12/2016.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import GridItem from './GridItem';

const ReactGridLayout = WidthProvider(Responsive);

export default function Grid({ children, isEditMode, onGridDataChange, style }) {
    function saveChangedItems(layout) {
        if (isEditMode) {
            _.each(layout, item => {
                onGridDataChange(item.i, {
                    height: item.h,
                    width: item.w,
                    x: item.x,
                    y: item.y
                });
            });
        }
    }

    function processGridItem(el) {
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

    return (
        <ReactGridLayout
            className={['layout', isEditMode && 'isEditMode'].join(' ')}
            breakpoints={{ lg: 1000, md: 800, sm: 640, xs: 320, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 2 }}
            rowHeight={10}
            onLayoutChange={saveChangedItems}
            isDraggable={isEditMode}
            isResizable={isEditMode}
            useCSSTransforms={false}
            style={style}
        >
            {_.map(children, processGridItem)}
        </ReactGridLayout>
    );
}

Grid.propTypes = {
    children: PropTypes.node.isRequired,
    onGridDataChange: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    style: PropTypes.shape({})
};

Grid.defaultProps = {
    style: undefined
};
