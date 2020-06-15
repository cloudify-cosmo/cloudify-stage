/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import Users from '../../app/components/Users';
import * as BasicComponents from '../../app/components/basic';

describe('(Component) Users', () => {
    global.Stage = { Basic: BasicComponents };
    const { Dropdown } = Stage.Basic;

    const manager = {
        username: 'admin',
        auth: {
            role: 'admin'
        }
    };

    const mockStore = configureMockStore();
    const store = mockStore({
        manager: {
            username: 'admin',
            auth: {
                role: 'admin'
            }
        }
    });
    const getUsers = props => {
        const provider = mount(
            <Provider store={store}>
                <Users
                    manager={manager}
                    showAllOptions
                    isEditMode={false}
                    canChangePassword
                    canEditMode
                    canTemplateManagement
                    canLicenseManagement
                    onEditModeChange={() => {}}
                    onReset={() => {}}
                    onTemplates={() => {}}
                    onLogout={() => {}}
                    onLicense={() => {}}
                    {...props}
                />
            </Provider>
        );
        return provider.find(Users);
    };

    it('renders...', () => {
        const wrapper = getUsers();
        expect(wrapper).to.have.length(1);
    });

    it('renders user menu with full options list ', () => {
        const wrapper = getUsers();
        expect(wrapper.find(Dropdown)).to.have.length(1); // Showing the users menu
        expect(wrapper.find(Dropdown.Item).length).to.equal(6); // 5 menu options
        expect(wrapper.find(Dropdown.Item).get(0).props.text).to.equal('Edit Mode'); // Having Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(0).props.icon).to.equal('configure'); // Having configure icon for Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(1).props.text).to.equal('Template Management'); // Having Template management option
        expect(wrapper.find(Dropdown.Item).get(1).props.icon).to.equal('list layout'); // Having list layout icon for Template management option
        expect(wrapper.find(Dropdown.Item).get(2).props.text).to.equal('Reset Templates'); // Having Reset Templates option
        expect(wrapper.find(Dropdown.Item).get(2).props.icon).to.equal('undo'); // Having configure icon for Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(3).props.text).to.equal('License Management'); // Having License Management option
        expect(wrapper.find(Dropdown.Item).get(3).props.icon).to.equal('key'); // Having key icon for License Management option
        expect(wrapper.find(Dropdown.Item).get(4).props.text).to.equal('Change Password'); // Having Change Password option
        expect(wrapper.find(Dropdown.Item).get(4).props.icon).to.equal('lock'); // Having lock icon for Change Password
        expect(wrapper.find(Dropdown.Item).get(5).props.text).to.equal('Logout'); // Having Logout option
        expect(wrapper.find(Dropdown.Item).get(5).props.icon).to.equal('log out'); // Having log out icon for Logout option
    });

    it('renders user menu with full options list and edit mode selected ', () => {
        const wrapper = getUsers({ isEditMode: true });

        expect(wrapper.find(Dropdown)).to.have.length(1); // Showing the users menu
        expect(wrapper.find(Dropdown.Item).length).to.equal(6); // 6 menu options
        expect(wrapper.find(Dropdown.Item).get(0).props.text).to.equal('Exit Edit Mode'); // Having Exit Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(0).props.selected).to.equal(true); // Having Edit Mode option selected
    });

    it('renders user menu with limited options list ', () => {
        const wrapper = getUsers({ showAllOptions: false });

        expect(wrapper.find(Dropdown)).to.have.length(1); // Showing the users menu
        expect(wrapper.find(Dropdown.Item).length).to.equal(3); // 3 menu options
        expect(wrapper.find(Dropdown.Item).get(0).props.text).to.equal('Reset Templates'); // Having Reset Templates option
        expect(wrapper.find(Dropdown.Item).get(0).props.icon).to.equal('undo'); // Having configure icon for Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(1).props.text).to.equal('Change Password'); // Having Change Password option
        expect(wrapper.find(Dropdown.Item).get(1).props.icon).to.equal('lock'); // Having lock icon for Change Password
        expect(wrapper.find(Dropdown.Item).get(2).props.text).to.equal('Logout'); // Having Logout option
        expect(wrapper.find(Dropdown.Item).get(2).props.icon).to.equal('log out'); // Having log out icon for Logout option
    });

    it('onEditModeChange is called', () => {
        const onEditModeChange = sinon.spy();
        const wrapper = getUsers({ onEditModeChange });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Edit Mode')
            .simulate('click');

        expect(onEditModeChange.calledOnce).to.equal(true);
    });

    it('onTemplates is called', () => {
        const onTemplates = sinon.spy();
        const wrapper = getUsers({ onTemplates });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Template Management')
            .simulate('click');

        expect(onTemplates.calledOnce).to.equal(true);
    });

    it('onReset is called', () => {
        const onReset = sinon.spy();
        const wrapper = getUsers({ onReset });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Reset Templates')
            .simulate('click');

        expect(onReset.calledOnce).to.equal(true);
    });

    it('onLicense is called', () => {
        const onLicense = sinon.spy();
        const wrapper = getUsers({ onLicense });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'License Management')
            .simulate('click');

        expect(onLicense.calledOnce).to.equal(true);
    });

    it('onChangePassword is called', () => {
        global.requestAnimationFrame = () => {};
        const wrapper = getUsers();

        expect(wrapper.state().showPasswordModal).to.equal(false);

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Change Password')
            .simulate('click');

        expect(wrapper.state().showPasswordModal).to.equal(true);
    });

    it('onLogout is called', () => {
        const onLogout = sinon.spy();
        const wrapper = getUsers({ onLogout });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Logout')
            .simulate('click');

        expect(onLogout.calledOnce).to.equal(true);
    });
});
