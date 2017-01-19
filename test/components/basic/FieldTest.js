/**
 * Created by pawelposel on 2017-01-11.
 */

import React from 'react'
import { shallow , mount} from 'enzyme'
import {expect} from 'chai';
import Field from '../../../app/components/basic/Field';

describe('(Component) Field', () => {

    it('default type', () => {
        let wrapper = shallow(<Field id="test" label="label" />);
        expect(wrapper).to.exist;

        expect(wrapper.find("input[data-type='string']")).to.have.length(1);
    });

    it('label popup', () => {
        let wrapper = shallow(<Field id="test" label="label" description="popup"/>);

        expect(wrapper.find("label i[data-content='popup']")).to.have.length(1);
        expect(wrapper.find('label')).to.have.text('label ');
    });

    it('string type', () => {
        let wrapper = shallow(<Field id="test" type="string" label="label" icon="rocket" value="test"/>);

        expect(wrapper.find("input[data-type='string']")).to.have.length(1);
        expect(wrapper.find("input[type='text']")).to.have.length(1);
        expect(wrapper.find("input[defaultValue='test']")).to.have.length(1);
        expect(wrapper.find('.input i')).to.have.className('rocket');
    });

    it('number type', () => {
        let wrapper = shallow(<Field id="test" type="number" label="label" value="5"/>);

        expect(wrapper.find("input[data-type='number']")).to.have.length(1);
        expect(wrapper.find("input[type='number']")).to.have.length(1);
        expect(wrapper.find("input[defaultValue='5']")).to.have.length(1);
    });

    it('boolean type', () => {
        let wrapper = shallow(<Field id="test" type="boolean" label="label" value="true"/>);

        expect(wrapper.find("input[data-type='boolean']")).to.have.length(1);
        expect(wrapper.find("input[type='checkbox']")).to.have.length(1);
        expect(wrapper.find("input[checked]")).to.have.length(1);
    });

    it('list type', () => {
        let wrapper = shallow(<Field id="test" type="list" items={[1,2,3]} label="label" value="2" placeholder="placeholder"/>);

        expect(wrapper.find(".dropdown input[data-type='list']")).to.have.length(1);
        expect(wrapper.find("input[type='hidden']")).to.have.length(1);
        expect(wrapper.find("input[value='2']")).to.have.length(1);
        expect(wrapper.find('.default.text')).to.have.text('placeholder');
        expect(wrapper.find('.menu .item')).to.have.length(3);
        expect(wrapper.find('.menu').childAt(1)).to.have.text('2');

        wrapper.setProps({items:[{value:1, name:"one"}, {value:2, name:'two'}, {value:3, name:'three'}]});
        expect(wrapper.find('.menu').childAt(1)).to.have.text('two');
    });

    it('multi selection list type', () => {
        let wrapper = shallow(<Field id="test" type="multiSelectList" items={[1,2,3,{value:4, name:'four'}, {value:5, name:'five'}]}
                                     label="label" value="2,3,4" placeholder="placeholder"/>);

        expect(wrapper.find(".dropdown input[data-type='multiSelectList']")).to.have.length(1);
        expect(wrapper.find("input[type='hidden']")).to.have.length(1);
        expect(wrapper.find("input[value='2,3,4']")).to.have.length(1);
        expect(wrapper.find('.default.text')).to.have.text('placeholder');
        expect(wrapper.find('.menu .item')).to.have.length(5);
        expect(wrapper.find('.menu').childAt(1)).to.have.text('2');
        expect(wrapper.find('.menu').childAt(3)).to.have.text('four');
    });

});

