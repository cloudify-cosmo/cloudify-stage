/**
 * Created by pawelposel on 2017-01-11.
 */

import React from 'react'
import { shallow , mount} from 'enzyme'
import {expect} from 'chai';
import GenericField from '../../../app/components/basic/form/GenericField';
import {createToolbox} from '../../../app/utils/Toolbox';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();
const store = mockStore({config: { widgets: {} }});
createToolbox(store);

describe('(Component) Field', () => {

    it('default type', () => {
        let wrapper = mount(<GenericField name="test" label="label" />);
        expect(wrapper).to.exist;

        expect(wrapper.find('input[name="test"]')).to.have.length(1);
    });

    it('label popup', () => {
        let wrapper = mount(<GenericField name="test" label="label" description="popup"/>);

        expect(wrapper.find('input[name="test"]')).to.have.length(1);
        expect(wrapper.find('label i')).to.have.length(1);
        expect(wrapper.find('label')).to.have.text('label ');
    });

    it('string type', () => {
        let wrapper = mount(<GenericField name="test" type="string" label="label" icon="rocket" value="test"/>);

        expect(wrapper.find('input[name="test"]')).to.have.length(1);
        expect(wrapper.find('input[type="text"]')).to.have.length(1);
        expect(wrapper.find('input[value="test"]')).to.have.length(1);
        expect(wrapper.find('.input i')).to.have.className('rocket');
    });

    it('number type', () => {
        let wrapper = mount(<GenericField name="test" type="number" label="label" value="5"/>);

        expect(wrapper.find('input[name="test"]')).to.have.length(1);
        expect(wrapper.find('input[type="number"]')).to.have.length(1);
        expect(wrapper.find('input[value="5"]')).to.have.length(1);
    });

    it('boolean type', () => {
        let wrapper = mount(<GenericField name="test" type="boolean" label="label" value="true"/>);

        expect(wrapper.find('input[name="test"]')).to.have.length(1);
        expect(wrapper.find('input[type="checkbox"]')).to.have.length(1);
        expect(wrapper.find('input[checked]')).to.have.length(1);
    });

    it('boolean list type', () => {
        let wrapper = mount(<GenericField name="test" type="booleanList" label="label" value={true} />);

        expect(wrapper.find('div[role="option"].selected span')).to.have.text('true');
        expect(wrapper.find('div[role="listbox"].multiple')).to.have.length(0);
        expect(wrapper.find('div[role="listbox"] div[role="option"]')).to.have.length(2);
        expect(wrapper.find('div[role="listbox"] div.menu').childAt(0)).to.have.text('false');
        expect(wrapper.find('div[role="listbox"] div.menu').childAt(1)).to.have.text('true');
    });

    it('list type', () => {
        let wrapper = mount(<GenericField name="test" type="list" items={[1,2,3]} label="label" value="2" placeholder="placeholder"/>);

        expect(wrapper.find('div[role="option"].selected span')).to.have.text('2');
        expect(wrapper.find('div[role="listbox"].multiple')).to.have.length(0);
        expect(wrapper.find('div[role="listbox"] div[role="option"]')).to.have.length(4);
        expect(wrapper.find('div[role="listbox"] div.menu').childAt(1)).to.have.text('2');

        wrapper.setProps({items:[{value:1, name:'one'}, {value:2, name:'two'}, {value:3, name:'three'}]});
        expect(wrapper.find('div[role="listbox"] div.menu').childAt(1)).to.have.text('two');
    });

    it('multi selection list type', () => {
        let wrapper = mount(<GenericField name="test" type="multiSelectList" items={[1,2,3,{value:4, name:'four'}, {value:5, name:'five'}]}
                                          label="label" value={[2,3,4]} placeholder="placeholder"/>);

        expect(wrapper.find('div[role="listbox"].multiple')).to.have.length(1);

        expect(wrapper.find('div[role="listbox"] div[role="option"]')).to.have.length(2);
        expect(wrapper.find('div[role="listbox"] div.menu').childAt(0)).to.have.text('1');
        expect(wrapper.find('div[role="listbox"] div.menu').childAt(1)).to.have.text('five');

        expect(wrapper.find('a')).to.have.length(3);
        expect(wrapper.find('a').at(0).text()).to.equal('2');
        expect(wrapper.find('a').at(1).text()).to.equal('3');
        expect(wrapper.find('a').at(2).text()).to.equal('four');
    });

});

