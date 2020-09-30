/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import Users from 'components/Users';
import * as BasicComponents from 'components/basic';

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
    const getUsers = ({
        isEditMode = false,
        showAllOptions = true,
        onEditModeChange,
        onTemplates,
        onReset,
        onLicense,
        onLogout
    } = {}) => {
        const provider = mount(
            <Provider store={store}>
                <Users
                    manager={manager}
                    showAllOptions={showAllOptions}
                    isEditMode={isEditMode}
                    canChangePassword
                    canEditMode
                    canTemplateManagement
                    canLicenseManagement
                    onEditModeChange={onEditModeChange}
                    onReset={onReset}
                    onTemplates={onTemplates}
                    onLogout={onLogout}
                    onLicense={onLicense}
                />
            </Provider>
        );
        return provider.find(Users);
    };

    it('renders...', () => {
        const wrapper = getUsers();
        expect(wrapper).toHaveLength(1);
    });

    it('renders user menu with full options list ', () => {
        const wrapper = getUsers();
        expect(wrapper.find(Dropdown)).toHaveLength(1); // Showing the users menu
        expect(wrapper.find(Dropdown.Item).length).toBe(6); // 5 menu options
        expect(wrapper.find(Dropdown.Item).get(0).props.text).toBe('Edit Mode'); // Having Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(0).props.icon).toBe('configure'); // Having configure icon for Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(1).props.text).toBe('Template Management'); // Having Template management option
        expect(wrapper.find(Dropdown.Item).get(1).props.icon).toBe('list layout'); // Having list layout icon for Template management option
        expect(wrapper.find(Dropdown.Item).get(2).props.text).toBe('Reset Templates'); // Having Reset Templates option
        expect(wrapper.find(Dropdown.Item).get(2).props.icon).toBe('undo'); // Having configure icon for Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(3).props.text).toBe('License Management'); // Having License Management option
        expect(wrapper.find(Dropdown.Item).get(3).props.icon).toBe('key'); // Having key icon for License Management option
        expect(wrapper.find(Dropdown.Item).get(4).props.text).toBe('Change Password'); // Having Change Password option
        expect(wrapper.find(Dropdown.Item).get(4).props.icon).toBe('lock'); // Having lock icon for Change Password
        expect(wrapper.find(Dropdown.Item).get(5).props.text).toBe('Logout'); // Having Logout option
        expect(wrapper.find(Dropdown.Item).get(5).props.icon).toBe('log out'); // Having log out icon for Logout option
    });

    it('renders user menu with full options list and edit mode selected ', () => {
        const wrapper = getUsers({ isEditMode: true });

        expect(wrapper.find(Dropdown)).toHaveLength(1); // Showing the users menu
        expect(wrapper.find(Dropdown.Item).length).toBe(6); // 6 menu options
        expect(wrapper.find(Dropdown.Item).get(0).props.text).toBe('Exit Edit Mode'); // Having Exit Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(0).props.selected).toBe(true); // Having Edit Mode option selected
    });

    it('renders user menu with limited options list ', () => {
        const wrapper = getUsers({ showAllOptions: false });

        expect(wrapper.find(Dropdown)).toHaveLength(1); // Showing the users menu
        expect(wrapper.find(Dropdown.Item).length).toBe(3); // 3 menu options
        expect(wrapper.find(Dropdown.Item).get(0).props.text).toBe('Reset Templates'); // Having Reset Templates option
        expect(wrapper.find(Dropdown.Item).get(0).props.icon).toBe('undo'); // Having configure icon for Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(1).props.text).toBe('Change Password'); // Having Change Password option
        expect(wrapper.find(Dropdown.Item).get(1).props.icon).toBe('lock'); // Having lock icon for Change Password
        expect(wrapper.find(Dropdown.Item).get(2).props.text).toBe('Logout'); // Having Logout option
        expect(wrapper.find(Dropdown.Item).get(2).props.icon).toBe('log out'); // Having log out icon for Logout option
    });

    it('onEditModeChange is called', () => {
        const onEditModeChange = sinon.spy();
        const wrapper = getUsers({ onEditModeChange });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Edit Mode')
            .simulate('click');

        expect(onEditModeChange.calledOnce).toBe(true);
    });

    it('onTemplates is called', () => {
        const onTemplates = sinon.spy();
        const wrapper = getUsers({ onTemplates });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Template Management')
            .simulate('click');

        expect(onTemplates.calledOnce).toBe(true);
    });

    it('onReset is called', () => {
        const onReset = sinon.spy();
        const wrapper = getUsers({ onReset });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Reset Templates')
            .simulate('click');

        expect(onReset.calledOnce).toBe(true);
    });

    it('onLicense is called', () => {
        const onLicense = sinon.spy();
        const wrapper = getUsers({ onLicense });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'License Management')
            .simulate('click');

        expect(onLicense.calledOnce).toBe(true);
    });

    it('onChangePassword is called', () => {
        global.requestAnimationFrame = () => {};
        const wrapper = getUsers();

        expect(wrapper.state().showPasswordModal).toBe(false);

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Change Password')
            .simulate('click');

        expect(wrapper.state().showPasswordModal).toBe(true);
    });

    it('onLogout is called', () => {
        const onLogout = sinon.spy();
        const wrapper = getUsers({ onLogout });

        wrapper
            .find(Dropdown.Item)
            .filterWhere(element => element.instance().props.text === 'Logout')
            .simulate('click');

        expect(onLogout.calledOnce).toBe(true);
    });
});
