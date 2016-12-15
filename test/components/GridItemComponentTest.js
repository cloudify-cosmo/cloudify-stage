/**
 * Created by kinneretzin on 15/12/2016.
 */

import React from 'react'
import { shallow , mount} from 'enzyme'
import {expect} from 'chai';
import sinon from 'sinon';

import GridItem from '../../app/components/layout/GridItem';

describe('(Component) GridItem',()=>{
    var wrapper = shallow( <GridItem
        id='1a'
        x={1} y={2}
        height={3} width={4}
        zIndex={undefined}
        className='test'>
        <div className='itemContent'/>
    </GridItem>);

    it('renders',()=>{
        expect(wrapper).to.have.length(1);
    });

    it('renders children',()=>{
        expect(wrapper.find('div.itemContent')).to.have.length(1);
    });

    it('creates the right grid-stack item',()=>{
        expect(wrapper.prop('id')).to.equal('1a');
        expect(wrapper.hasClass('grid-stack-item')).to.be.true;
        expect(wrapper.hasClass('test')).to.be.true;
        expect(wrapper.prop('style')).is.empty;
    });

    it('set the right initial positioning properties',()=>{
        expect(wrapper.prop('data-gs-auto-position')).to.be.false;
        expect(wrapper.prop('data-gs-x')).to.equal(1);
        expect(wrapper.prop('data-gs-y')).to.equal(2);
        expect(wrapper.prop('data-gs-height')).to.equal(3);
        expect(wrapper.prop('data-gs-width')).to.equal(4);
    });

    it('No props were sent',()=>{
        var wrapper = shallow( <GridItem id='1a'></GridItem>);

        expect(wrapper).to.have.length(1);
        expect(wrapper.prop('data-gs-auto-position')).to.be.true;
        expect(wrapper.prop('data-gs-x')).to.be.undefined;
        expect(wrapper.prop('data-gs-y')).to.be.undefined
        expect(wrapper.prop('data-gs-width')).to.equal(1);
        expect(wrapper.prop('data-gs-height')).to.equal(1);
        expect(wrapper.prop('zIndex')).to.be.undefined;
        expect(wrapper.prop('className').trim()).to.equal('grid-stack-item'); // No additional classes
    });

    it('No positioning props were sent - use auto position',()=>{
        var wrapper = shallow( <GridItem id='1a' width={10} height={20}></GridItem>);

        expect(wrapper).to.have.length(1);
        expect(wrapper.prop('data-gs-auto-position')).to.be.true;
        expect(wrapper.prop('data-gs-x')).to.be.undefined;
        expect(wrapper.prop('data-gs-y')).to.be.undefined
        expect(wrapper.prop('data-gs-width')).to.equal(10);
        expect(wrapper.prop('data-gs-height')).to.equal(20);
    });

    describe('Test lifecycle - calling add/remove of item',()=>{

        it('Calling itemAdded callback', ()=>{
            var onItemAdded = sinon.spy();
            var m = mount( <GridItem id='1a' onItemAdded={onItemAdded}></GridItem>);

            expect(onItemAdded.calledOnce).to.equal(true);
            expect(onItemAdded.calledWithExactly('1a')).to.equal(true);
        });

        it('Calling itemRemoved callback', ()=>{
            var onItemRemoved = sinon.spy();
            var m = mount( <GridItem id='1b' onItemRemoved={onItemRemoved}></GridItem>);

            m.unmount();
            expect(onItemRemoved.calledOnce).to.equal(true);
            expect(onItemRemoved.calledWithExactly('1b')).to.equal(true);
        });

    });
});