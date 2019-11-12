/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Users from '../../app/components/Users.js';
import * as BasicComponents from '../../app/components/basic';

describe('(Component) Users', () => {
    let manager;
    let wrapper;
    global.Stage = { Basic: BasicComponents };
    const { Dropdown } = Stage.Basic;

    beforeEach(() => {
        manager = {
            username: 'admin',
            auth: {
                role: 'admin'
            }
        };

        wrapper = mount(
            <Users
                manager={manager}
                showAllOptions
                isEditMode={false}
                canEditMode
                canTemplateManagement
                canLicenseManagement
                onEditModeChange={() => {}}
                onReset={() => {}}
                onTemplates={() => {}}
                onLogout={() => {}}
                onLicense={() => {}}
            />
        );
    });

    it('renders...', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders user menu with full options list ', () => {
        expect(wrapper.find(Dropdown)).to.have.length(1); // Showing the users menu
        expect(wrapper.find(Dropdown.Item).length).to.equal(5); // 5 menu options
        expect(wrapper.find(Dropdown.Item).get(0).props.text).to.equal('Edit Mode'); // Having Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(0).props.icon).to.equal('configure'); // Having configure icon for Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(1).props.text).to.equal('Template Management'); // Having Template management option
        expect(wrapper.find(Dropdown.Item).get(1).props.icon).to.equal('list layout'); // Having list layout icon for Template management option
        expect(wrapper.find(Dropdown.Item).get(2).props.text).to.equal('Reset Templates'); // Having Reset Templates option
        expect(wrapper.find(Dropdown.Item).get(2).props.icon).to.equal('undo'); // Having configure icon for Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(3).props.text).to.equal('License Management'); // Having License Management option
        expect(wrapper.find(Dropdown.Item).get(3).props.icon).to.equal('key'); // Having key icon for License Management option
        expect(wrapper.find(Dropdown.Item).get(4).props.text).to.equal('Logout'); // Having Logout option
        expect(wrapper.find(Dropdown.Item).get(4).props.icon).to.equal('log out'); // Having log out icon for Logout option
    });

    it('renders user menu with full options list and edit mode selected ', () => {
        wrapper.setProps({ isEditMode: true });

        expect(wrapper.find(Dropdown)).to.have.length(1); // Showing the users menu
        expect(wrapper.find(Dropdown.Item).length).to.equal(5); // 5 menu options
        expect(wrapper.find(Dropdown.Item).get(0).props.text).to.equal('Exit Edit Mode'); // Having Exit Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(0).props.selected).to.equal(true); // Having Edit Mode option selected
    });

    it('renders user menu with limited options list ', () => {
        wrapper.setProps({ showAllOptions: false });

        expect(wrapper.find(Dropdown)).to.have.length(1); // Showing the users menu
        expect(wrapper.find(Dropdown.Item).length).to.equal(2); // 2 menu options
        expect(wrapper.find(Dropdown.Item).get(0).props.text).to.equal('Reset Templates'); // Having Reset Templates option
        expect(wrapper.find(Dropdown.Item).get(0).props.icon).to.equal('undo'); // Having configure icon for Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(1).props.text).to.equal('Logout'); // Having Logout option
        expect(wrapper.find(Dropdown.Item).get(1).props.icon).to.equal('log out'); // Having log out icon for Logout option
    });

    it('onEditModeChange is called', () => {
        const onEditModeChange = sinon.spy();
        wrapper.setProps({ onEditModeChange });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Edit Mode')
            .simulate('click');

        expect(onEditModeChange.calledOnce).to.equal(true);
    });

    it('onTemplates is called', () => {
        const onTemplates = sinon.spy();
        wrapper.setProps({ onTemplates });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Template Management')
            .simulate('click');

        expect(onTemplates.calledOnce).to.equal(true);
    });

    it('onReset is called', () => {
        const onReset = sinon.spy();
        wrapper.setProps({ onReset });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Reset Templates')
            .simulate('click');

        expect(onReset.calledOnce).to.equal(true);
    });

    it('onLicense is called', () => {
        const onLicense = sinon.spy();
        wrapper.setProps({ onLicense });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'License Management')
            .simulate('click');

        expect(onLicense.calledOnce).to.equal(true);
    });

    it('onLogout is called', () => {
        const onLogout = sinon.spy();
        wrapper.setProps({ onLogout });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Logout')
            .simulate('click');

        expect(onLogout.calledOnce).to.equal(true);
    });
});
