/**
 * Created by kinneretzin on 08/12/2016.
 */

import React from 'react'
import { shallow , mount} from 'enzyme'
import {expect} from 'chai';
import Tenants from '../../app/components/Tenants.js';
import sinon from 'sinon';

describe('(Component) Tenants', () => {
    var manager;
    var wrapper;

    beforeEach(() => {
       manager = {
            tenants: {
                isFetching: false,
                    items: [],
                    selected: null
            }
        };

        wrapper = shallow(<Tenants manager={manager}
                                   onTenantChange={()=>{}}
                                   onLogout={()=>{}}
                                   fetchTenants={()=>{}}/>);
    });

    it('renders...', () => {
        expect(wrapper).to.have.length(1);
    });

    it('renders loading when fetching tenants',()=>{
        manager.tenants.isFetching = true;
        wrapper.setProps({manager: manager});
        expect(wrapper.find('div.loader')).to.have.length(1);
    });

    it('renders empty tenants list ',()=>{
        manager.tenants.isFetching = false;
        manager.tenants.items=[];
        wrapper.setProps({manager: manager});

        expect(wrapper.find('div.loader')).to.have.length(0); // Loader not existing
        expect(wrapper.find('.dropdown.tenantsMenu')).to.have.length(1); // Showing the tenatns menu
        expect(wrapper.find('.dropDownText').text()).to.equal('No Tenants'); // Showing 'No Tenatns' text
        expect(wrapper.find('.tenantsMenu .menu .item.logout')).to.have.length(1); // Having a logout button in the dropdown
        expect(wrapper.find('.tenantsMenu .menu .item')).to.have.length(1); // Having only one item in the dropdown (the logout)
    });

    it('renders tenants list no selected',()=>{
        manager.tenants.isFetching = false;
        manager.tenants.items=[{name:'aaa'},{name:'bbb'},{name:'ccc'}];
        wrapper.setProps({manager: manager});

        expect(wrapper.find('div.loader')).to.have.length(0); // Loader not existing
        expect(wrapper.find('.dropdown.tenantsMenu')).to.have.length(1); // Showing the tenatns menu
        expect(wrapper.find('.dropDownText').text()).to.equal('aaa'); // Showing the default tenant (first one) if no 'selected one was stated'
        expect(wrapper.find('.tenantsMenu .menu .item.logout')).to.have.length(1); // Having a logout button in the dropdown
        expect(wrapper.find('.tenantsMenu .menu .item')).to.have.length(4); // Having 4 items in the dropdown, 3 tenants and one logout
        expect(wrapper.find('.tenantsMenu .menu .item.active.selected').text()).to.equal('aaa'); // Selected marked in the dropdown as the first value
    });

    it('renders tenants list has selected',()=>{
        manager.tenants.isFetching = false;
        manager.tenants.items=[{name:'aaa'},{name:'bbb'},{name:'ccc'}];
        manager.tenants.selected = 'bbb';
        wrapper.setProps({manager: manager});

        expect(wrapper.find('div.loader')).to.have.length(0); // Loader not existing
        expect(wrapper.find('.dropdown.tenantsMenu')).to.have.length(1); // Showing the tenatns menu
        expect(wrapper.find('.dropDownText').text()).to.equal('bbb'); // Showing the default tenant (first one) if no 'selected one was stated'
        expect(wrapper.find('.tenantsMenu .menu .item.logout')).to.have.length(1); // Having a logout button in the dropdown
        expect(wrapper.find('.tenantsMenu .menu .item')).to.have.length(4); // Having 4 items in the dropdown, 3 tenants and one logout
        expect(wrapper.find('.tenantsMenu .menu .item.active.selected').text()).to.equal('bbb'); // Selected marked in the dropdown as the first value
    });

    it('renders tenants list has selected that isnt in the list',()=>{
        manager.tenants.isFetching = false;
        manager.tenants.items=[{name:'aaa'},{name:'bbb'},{name:'ccc'}];
        manager.tenants.selected = 'abc';
        wrapper.setProps({manager: manager});

        expect(wrapper.find('div.loader')).to.have.length(0); // Loader not existing
        expect(wrapper.find('.dropdown.tenantsMenu')).to.have.length(1); // Showing the tenatns menu
        expect(wrapper.find('.dropDownText').text()).to.equal('abc'); // Showing the default tenant (first one) if no 'selected one was stated'
        expect(wrapper.find('.tenantsMenu .menu .item.logout')).to.have.length(1); // Having a logout button in the dropdown
        expect(wrapper.find('.tenantsMenu .menu .item')).to.have.length(4); // Having 4 items in the dropdown, 3 tenants and one logout
        expect(wrapper.find('.tenantsMenu .menu .item.active.selected')).to.have.length(0);
    });
    
    it('logout is called',()=>{
        var onLogout = sinon.spy();

        var mounted = mount(<Tenants manager={manager}
                                     onTenantChange={()=>{}}
                                     onLogout={onLogout}
                                     fetchTenants={()=>{}}/>);

        mounted.find('.item.logout').simulate('click');
        expect(onLogout.calledOnce).to.equal(true);
    });

    it('onTenantChange is called',()=>{
        var onTenantChange = sinon.spy();

        manager.tenants.isFetching = false;
        manager.tenants.items=[{name:'aaa'},{name:'bbb'},{name:'ccc'}];
        manager.tenants.selected = 'abc';

        var mounted = mount(<Tenants manager={manager}
                                     onTenantChange={onTenantChange}
                                     onLogout={()=>{}}
                                     fetchTenants={()=>{}}/>);

        mounted.find('.tenantsMenu .menu .item').first().simulate('click');
        expect(onTenantChange.calledOnce).to.equal(true);
        expect(onTenantChange.calledWithExactly('aaa')).to.equal(true);

    });

});
