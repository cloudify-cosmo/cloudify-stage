import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import { ReactGridLayoutProps, Responsive } from 'react-grid-layout';
import { useSelector } from 'react-redux';
import { useWidthObserver } from '../../utils/hooks';
import GridItem from './GridItem';
import { ReduxState } from '../../reducers';
import { collapsedSidebarWidth, expandedSidebarWidth } from '../sidebar/SideBar';

const ReactGridLayout = Responsive;

interface GridProps {
    isEditMode: boolean;
    onGridDataChange: (key: string, item: { height: number; width: number; x: number; y: number }) => void;
    style?: CSSProperties;
}

export default function Grid({ children, isEditMode, onGridDataChange, style }: PropsWithChildren<GridProps>) {
    const [wrapperRef, getWidth] = useWidthObserver();
    const isPagePreview = useSelector((state: ReduxState) => state.templateManagement.isActive);

    const saveChangedItems: ReactGridLayoutProps['onLayoutChange'] = layout => {
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
    };

    function processGridItem(el: ReactNode) {
        if (!React.isValidElement(el) || el.type !== GridItem) {
            return [];
        }
        return React.createElement(
            'div',
            {
                key: el.props.id,
                className: [el.props.className, el.props.maximized && 'maximize'].join(' '),
                style: el.props.maximized && {
                    marginLeft: isPagePreview ? expandedSidebarWidth : collapsedSidebarWidth
                },
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

    const width = getWidth();

    return (
        /**
         * NOTE: Use `useWidthObserver` instead of `react-grid-layout`'s `WidthProvider`
         * to resize the layout when its width changes due to other components
         * changing their size. This happens when there is a resizeable
         * component nearby that causes the layout to shrink/expand according
         * to user actions.
         * `WidthProvider` only detects browser resize events.
         */
        <div ref={wrapperRef}>
            {width && (
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
                    width={width}
                >
                    {/* NOTE: `map` handles non-array items fine */}
                    {_.map(children as ReactNode[], processGridItem)}
                </ReactGridLayout>
            )}
        </div>
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
