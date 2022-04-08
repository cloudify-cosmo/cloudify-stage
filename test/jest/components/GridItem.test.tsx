import { mount } from 'enzyme';
import React from 'react';

import GridItem from 'components/layout/GridItem';

describe('(Component) GridItem', () => {
    const wrapper = mount(
        <GridItem id="1a" x={1} y={2} height={3} width={4} className="test">
            <div className="itemContent" />
        </GridItem>
    );

    it('renders', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('renders children', () => {
        expect(wrapper.find('div.itemContent')).toHaveLength(1);
    });

    it('creates the right  GridItem', () => {
        expect(wrapper.prop('id')).toBe('1a');
        expect(wrapper.hasClass('test')).toBeTruthy();
        expect(wrapper.prop('style')).toBeUndefined();
    });

    it('set the right initial positioning properties', () => {
        expect(wrapper.prop('x')).toBe(1);
        expect(wrapper.prop('y')).toBe(2);
        expect(wrapper.prop('height')).toBe(3);
        expect(wrapper.prop('width')).toBe(4);
    });

    it('No props were sent', () => {
        const gridItem = mount(<GridItem id="1a">{[]}</GridItem>);
        expect(gridItem).toHaveLength(1);
        expect(gridItem.prop('x')).toBe(0);
        expect(gridItem.prop('y')).toBe(0);
        expect(gridItem.prop('width')).toBe(10);
        expect(gridItem.prop('height')).toBe(5);
    });

    it('No positioning props were sent - use auto position', () => {
        const gridItem = mount(
            <GridItem id="1a" width={10} height={20}>
                {[]}
            </GridItem>
        );

        expect(gridItem).toHaveLength(1);
        expect(gridItem.prop('x')).toBe(0);
        expect(gridItem.prop('y')).toBe(0);
        expect(gridItem.prop('width')).toBe(10);
        expect(gridItem.prop('height')).toBe(20);
    });

    describe('Test lifecycle - calling add/remove of item', () => {
        it('Calling itemAdded callback', () => {
            const onItemAdded = jest.fn();
            mount(
                <GridItem id="1a" onItemAdded={onItemAdded}>
                    {[]}
                </GridItem>
            );

            expect(onItemAdded).toHaveBeenCalled();
            expect(onItemAdded).toHaveBeenCalledWith('1a');
        });

        it('Calling itemRemoved callback', () => {
            const onItemRemoved = jest.fn();
            const m = mount(
                <GridItem id="1b" onItemRemoved={onItemRemoved}>
                    {[]}
                </GridItem>
            );

            m.unmount();
            expect(onItemRemoved).toHaveBeenCalled();
            expect(onItemRemoved).toHaveBeenCalledWith('1b');
        });
    });
});
