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

    it('creates the right item',()=>{
        expect(wrapper.prop('id')).to.equal('1a');
        expect(wrapper.hasClass('test')).to.be.true;
        expect(wrapper.prop('style')).is.empty;
    });


    it('No props were sent',()=>{
        var wrapper = shallow( <GridItem id='1a'></GridItem>);

        expect(wrapper).to.have.length(1);
        expect(wrapper.prop('zIndex')).to.be.undefined;
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