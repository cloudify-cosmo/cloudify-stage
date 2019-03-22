/**
 * Created by jakubniezgoda on 22/03/2019.
 */

import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai';
import Help from '../../app/components/Help.js';
import * as BasicComponents from '../../app/components/basic';
import sinon from 'sinon';

describe('(Component) Help', () => {
    let wrapper = null;
    let dropdownItemComponents = null;
    let redirectToPage = sinon.spy();
    let onAbout = sinon.spy();
    global.Stage = {Basic: BasicComponents, Utils: { redirectToPage }};
    let {Dropdown} = Stage.Basic;

    beforeEach(() => {
        wrapper = mount(<Help onAbout={onAbout} />);
        dropdownItemComponents = wrapper.find(Dropdown.Item);
    });

    it('renders help menu', () => {
        expect(wrapper.find(Dropdown)).to.have.length(1);

        const dropdownItemComponents = wrapper.find(Dropdown.Item);
        expect(dropdownItemComponents.length).to.equal(5);

        expect(dropdownItemComponents.get(0).props.text).to.equal('Documentation');
        expect(dropdownItemComponents.get(0).props.icon).to.equal('book');

        expect(dropdownItemComponents.get(1).props.text).to.equal('Tutorials');
        expect(dropdownItemComponents.get(1).props.icon).to.equal('video camera');

        expect(dropdownItemComponents.get(2).props.text).to.equal('Knowledge Base');
        expect(dropdownItemComponents.get(2).props.icon).to.equal('student');

        expect(dropdownItemComponents.get(3).props.text).to.equal('Contact Us');
        expect(dropdownItemComponents.get(3).props.icon).to.equal('comments');

        expect(dropdownItemComponents.get(4).props.text).to.equal('About');
        expect(dropdownItemComponents.get(4).props.icon).to.equal('info circle');
    });

    it('calls onAbout function on click on About option',()=>{
        dropdownItemComponents.filterWhere(element => element.instance().props.text === 'About').simulate('click');
        expect(onAbout.calledOnce).to.equal(true);
    });

    it('calls redirectToPage function on click on Documentation, Tutorials, Knowledge Base and Contact Us options',()=>{
        dropdownItemComponents.filterWhere(element => element.instance().props.text === 'Documentation').simulate('click');
        expect(redirectToPage.calledWith('https://docs.cloudify.co')).to.equal(true);

        dropdownItemComponents.filterWhere(element => element.instance().props.text === 'Tutorials').simulate('click');
        expect(redirectToPage.calledWith('https://cloudify.co/academy')).to.equal(true);

        dropdownItemComponents.filterWhere(element => element.instance().props.text === 'Knowledge Base').simulate('click');
        expect(redirectToPage.calledWith('https://cloudify.co/knowledge-base')).to.equal(true);

        dropdownItemComponents.filterWhere(element => element.instance().props.text === 'Contact Us').simulate('click');
        expect(redirectToPage.calledWith('https://cloudify.co/community')).to.equal(true);
    });
});
