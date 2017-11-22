/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai';
import Users from '../../app/components/Users.js';
import * as BasicComponents from '../../app/components/basic';
import sinon from 'sinon';

describe('(Component) Users', () => {
    let manager;
    let wrapper;
    global.Stage = {Basic: BasicComponents};
    let {Dropdown} = Stage.Basic;

    beforeEach(() => {
         manager = {
             username: 'admin',
             auth: {
                 role: 'admin'
             }
         };

         wrapper = mount(<Users manager={manager}
                                showAllOptions={true}
                                isEditMode={false}
                                canEditMode={true}
                                canMaintenanceMode={true}
                                canConfigure={true}
                                canTemplateManagement={true}
                                onEditModeChange={()=>{}}
                                onConfigure={()=>{}}
                                onResetPages={()=>{}}
                                onReset={()=>{}}
                                onTemplates={()=>{}}
                                onLogout={()=>{}}/>);
    });

    it('renders...', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders user menu with full options list ',()=>{
        expect(wrapper.find(Dropdown)).to.have.length(1); // Showing the users menu
        expect(wrapper.find(Dropdown.Item).length).to.equal(5); // 3 menu options
        expect(wrapper.find(Dropdown.Item).get(0).props.text).to.equal('Maintenance Mode'); // Having Maintenance Mode option
        expect(wrapper.find(Dropdown.Item).get(0).props.icon).to.equal('doctor'); // Having doctor icon for Maintenance Mode option
        // expect(wrapper.find(Dropdown.Item).get(1).props.text).to.equal('Configure'); // Having Configure option
        // expect(wrapper.find(Dropdown.Item).get(1).props.icon).to.equal('options'); // Having settings icon for Configure option
        expect(wrapper.find(Dropdown.Item).get(1).props.text).to.equal('Edit Mode'); // Having Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(1).props.icon).to.equal('configure'); // Having configure icon for Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(2).props.text).to.equal('Template management'); // Having Template management option
        expect(wrapper.find(Dropdown.Item).get(2).props.icon).to.equal('list layout'); // Having list layout icon for Template management option
        expect(wrapper.find(Dropdown.Item).get(3).props.text).to.equal('Reset Templates'); // Having Reset Templates option
        expect(wrapper.find(Dropdown.Item).get(3).props.icon).to.equal('undo'); // Having configure icon for Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(4).props.text).to.equal('Logout'); // Having Logout option
        expect(wrapper.find(Dropdown.Item).get(4).props.icon).to.equal('log out'); // Having log out icon for Logout option
    });

    it('renders user menu with limited options list ',()=>{
        wrapper.setProps({showAllOptions: false});

        expect(wrapper.find(Dropdown)).to.have.length(1); // Showing the users menu
        expect(wrapper.find(Dropdown.Item).length).to.equal(2); // 2 menu options
        expect(wrapper.find(Dropdown.Item).get(0).props.text).to.equal('Reset Templates'); // Having Reset Templates option
        expect(wrapper.find(Dropdown.Item).get(0).props.icon).to.equal('undo'); // Having configure icon for Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(1).props.text).to.equal('Logout'); // Having Logout option
        expect(wrapper.find(Dropdown.Item).get(1).props.icon).to.equal('log out'); // Having log out icon for Logout option
    });

    it('renders user menu with full options list and edit mode selected ',()=>{
        wrapper.setProps({isEditMode: true});

        expect(wrapper.find(Dropdown)).to.have.length(1); // Showing the users menu
        expect(wrapper.find(Dropdown.Item).length).to.equal(5); // 5 menu options
        expect(wrapper.find(Dropdown.Item).get(1).props.text).to.equal('Exit Edit Mode'); // Having Exit Edit Mode option
        expect(wrapper.find(Dropdown.Item).get(1).props.selected).to.equal(true); // Having Edit Mode option selected
    });

    // it('onConfigure is called',()=>{
    //     let onConfigure = sinon.spy();
    //     wrapper.setProps({onConfigure});
    //
    //     wrapper.find(Dropdown.Item).filterWhere(element => element.getNode().props.text === 'Configure').simulate('click');
    //
    //     expect(onConfigure.calledOnce).to.equal(true);
    // });

    it('onEditModeChange is called',()=>{
        let onEditModeChange = sinon.spy();
        wrapper.setProps({onEditModeChange});

        wrapper.find(Dropdown.Item).filterWhere(element => element.getNode().props.text === 'Edit Mode').simulate('click');

        expect(onEditModeChange.calledOnce).to.equal(true);
    });

    it('onLogout is called',()=>{
        let onLogout = sinon.spy();
        wrapper.setProps({onLogout});

        wrapper.find(Dropdown.Item).filterWhere(element => element.getNode().props.text === 'Logout').simulate('click');

        expect(onLogout.calledOnce).to.equal(true);
    });

});
