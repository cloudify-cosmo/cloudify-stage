/**
 * Created by kinneretzin on 15/12/2016.
 */

import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

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
        const wrapper = mount(<GridItem id="1a">{[]}</GridItem>);
        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop('x')).toBe(0);
        expect(wrapper.prop('y')).toBe(0);
        expect(wrapper.prop('width')).toBe(10);
        expect(wrapper.prop('height')).toBe(5);
    });

    it('No positioning props were sent - use auto position', () => {
        const wrapper = mount(
            <GridItem id="1a" width={10} height={20}>
                {[]}
            </GridItem>
        );

        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop('x')).toBe(0);
        expect(wrapper.prop('y')).toBe(0);
        expect(wrapper.prop('width')).toBe(10);
        expect(wrapper.prop('height')).toBe(20);
    });

    describe('Test lifecycle - calling add/remove of item', () => {
        it('Calling itemAdded callback', () => {
            const onItemAdded = sinon.spy();
            mount(
                <GridItem id="1a" onItemAdded={onItemAdded}>
                    {[]}
                </GridItem>
            );

            expect(onItemAdded.calledOnce).toBe(true);
            expect(onItemAdded.calledWithExactly('1a')).toBe(true);
        });

        it('Calling itemRemoved callback', () => {
            const onItemRemoved = sinon.spy();
            const m = mount(
                <GridItem id="1b" onItemRemoved={onItemRemoved}>
                    {[]}
                </GridItem>
            );

            m.unmount();
            expect(onItemRemoved.calledOnce).toBe(true);
            expect(onItemRemoved.calledWithExactly('1b')).toBe(true);
        });
    });
});
