/**
 * Created by kinneretzin on 17/11/2016.
 */

import React from 'react'
import { shallow , mount} from 'enzyme'
import {expect} from 'chai';
import EditableLabel from '../../../app/components/basic/EditableLabel';

describe('(Component) EditableLabel', () => {

    describe('Edit mode' , () => {
        var wrapper = shallow(<EditableLabel text='kuku' isEditEnable={true} placeholder='Enter kuku'/>);

        it('renders...', () => {
            expect(wrapper).to.have.length(1);
        });

        it('renders label when in edit mode',()=>{
            expect(wrapper.find('label')).to.have.length(1);
        });

        it('shows text properly',()=>{
            expect(wrapper.find('label').text()).to.equal('kuku');
            expect(wrapper.find('label').hasClass('editPlaceholder')).to.be.false;
        });

        it('shows placeholder if text is empty (in edit mode)',()=>{
            var emptyWrapper = shallow(<EditableLabel isEditEnable={true} placeholder='Enter kuku'/>);

            expect(emptyWrapper.find('label').text()).to.equal('Enter kuku');
            expect(emptyWrapper.find('label').hasClass('editPlaceholder')).to.be.true;
        });
    });

    describe('Non edit mode' , () => {
        var wrapper = shallow(<EditableLabel text='kuku' isEditEnable={false} placeholder='Enter kuku'/>);

        it('renders...', () => {
            expect(wrapper).to.have.length(1);
        });

        it('shows text properly',()=>{
            expect(wrapper.find('label').text()).to.equal('kuku');
        });

        it('shows empty string text is empty (in none-edit mode)',()=>{
            var emptyWrapper = shallow(<EditableLabel isEditEnable={false} placeholder='Enter kuku'/>);
            expect(emptyWrapper.find('label').text()).to.be.empty;
        });
    });

});

