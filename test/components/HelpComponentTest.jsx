/**
 * Created by jakubniezgoda on 22/03/2019.
 */

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import StageUtils from '../../app/utils/stageUtils';
import * as BasicComponents from '../../app/components/basic';
import Help from '../../app/components/Help';
import HelpContainer from '../../app/containers/Help';

describe('(Component) Help', () => {
    global.Stage = { Basic: BasicComponents };
    const { Dropdown } = Stage.Basic;

    it('renders help menu', () => {
        const wrapper = mount(<Help onAbout={() => {}} version="5.0.5" />);
        expect(wrapper.find(Dropdown)).to.have.length(1);

        const dropdownItemComponents = wrapper.find(Dropdown.Item);
        expect(dropdownItemComponents.length).to.equal(3);

        expect(dropdownItemComponents.get(0).props.text).to.equal('Documentation');
        expect(dropdownItemComponents.get(0).props.icon).to.equal('book');

        expect(dropdownItemComponents.get(1).props.text).to.equal('Contact Us');
        expect(dropdownItemComponents.get(1).props.icon).to.equal('comments');

        expect(dropdownItemComponents.get(2).props.text).to.equal('About');
        expect(dropdownItemComponents.get(2).props.icon).to.equal('info circle');
    });

    it('calls onAbout function on click on About option', () => {
        const onAbout = sinon.spy();
        const wrapper = mount(<Help onAbout={onAbout} version="5.0.5" />);
        const dropdownItemComponents = wrapper.find(Dropdown.Item);

        dropdownItemComponents.filterWhere(element => element.instance().props.text === 'About').simulate('click');
        expect(onAbout).to.have.been.calledOnce;
    });

    it('calls redirectToPage function on click on Documentation and Contact Us options', () => {
        const redirectToPage = sinon.spy(StageUtils.Url, 'redirectToPage');
        const wrapper = mount(<Help onAbout={() => {}} version="5.0.5" />);
        const dropdownItemComponents = wrapper.find(Dropdown.Item);
        dropdownItemComponents
            .filterWhere(element => element.instance().props.text === 'Documentation')
            .simulate('click');
        expect(redirectToPage).to.have.been.calledWith('https://docs.cloudify.co/5.0.5');

        dropdownItemComponents.filterWhere(element => element.instance().props.text === 'Contact Us').simulate('click');
        expect(redirectToPage).to.have.been.calledWith('https://cloudify.co/contact');
        redirectToPage.restore();
    });

    it('calls redirectToPage function with latest link on click on Documentation ', () => {
        const redirectToPage = sinon.spy(StageUtils.Url, 'redirectToPage');
        const mockStore = configureMockStore();
        const store = mockStore({
            manager: {
                version: {
                    version: '5.0.5-dev1'
                }
            }
        });
        const wrapper = mount(
            <Provider store={store}>
                <HelpContainer onAbout={() => {}} />
            </Provider>
        );

        const dropdownItemComponents = wrapper.find(Dropdown.Item);
        dropdownItemComponents
            .filterWhere(element => element.instance().props.text === 'Documentation')
            .simulate('click');

        expect(redirectToPage).to.have.been.calledWith('https://docs.cloudify.co/latest');
        redirectToPage.restore();
    });
});
