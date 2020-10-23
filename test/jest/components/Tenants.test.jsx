/**
 * Created by kinneretzin on 08/12/2016.
 */

import { mount } from 'enzyme';
import sinon from 'sinon';
import Tenants from 'components/Tenants';
import * as BasicComponents from 'components/basic';

describe('(Component) Tenants', () => {
    let manager;
    let wrapper;
    global.Stage = { Basic: BasicComponents };

    beforeEach(() => {
        manager = {
            tenants: {
                isFetching: false,
                items: [],
                selected: null
            }
        };

        wrapper = mount(<Tenants manager={manager} onTenantChange={() => {}} onTenantsRefresh={() => {}} />);
    });

    it('renders...', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('renders loading when fetching tenants', () => {
        manager.tenants.isFetching = true;
        wrapper.setProps({ manager });

        expect(wrapper.find('div.loader')).toHaveLength(1);
    });

    it('renders empty tenants list ', () => {
        manager.tenants.isFetching = false;
        manager.tenants.items = [];
        wrapper.setProps({ manager });

        expect(wrapper.find('div.loader')).toHaveLength(0); // Loader not existing
        expect(wrapper.find('.dropdown.tenantsMenu')).toHaveLength(1); // Showing the tenants menu
        expect(wrapper.find('.dropdown.tenantsMenu > span > span').text()).toBe('No Tenants'); // Showing 'No Tenants' text
        expect(wrapper.find('.tenantsMenu .menu .item')).toHaveLength(0); // No options in dropdown
    });

    it('renders tenants list no selected', () => {
        manager.tenants.isFetching = false;
        manager.tenants.items = [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }];
        wrapper.setProps({ manager });

        expect(wrapper.find('div.loader')).toHaveLength(0); // Loader not existing
        expect(wrapper.find('.dropdown.tenantsMenu')).toHaveLength(1); // Showing the tenatns menu
        expect(wrapper.find('.dropdown.tenantsMenu > span > span').text()).toBe('aaa'); // Showing the default tenant (first one) if no 'selected one was stated'
        expect(wrapper.find('.tenantsMenu .menu .item')).toHaveLength(3); // Having 3 items in the dropdown
        expect(wrapper.find('.tenantsMenu .menu .item.selected').text()).toBe('aaa'); // Selected marked in the dropdown as the first value
    });

    it('renders tenants list has selected', () => {
        manager.tenants.isFetching = false;
        manager.tenants.items = [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }];
        manager.tenants.selected = 'bbb';
        wrapper.setProps({ manager });

        expect(wrapper.find('div.loader')).toHaveLength(0); // Loader not existing
        expect(wrapper.find('.dropdown.tenantsMenu')).toHaveLength(1); // Showing the tenants menu
        expect(wrapper.find('.dropdown.tenantsMenu > span > span').text()).toBe('bbb'); // Showing the default tenant (first one) if no 'selected one was stated'
        expect(wrapper.find('.tenantsMenu .menu .item')).toHaveLength(3); // Having 3 items in the dropdown
        expect(wrapper.find('.tenantsMenu .menu .item.selected').text()).toBe('bbb'); // Selected marked in the dropdown as the first value
    });

    it('renders tenants list has selected that isnt in the list', () => {
        manager.tenants.isFetching = false;
        manager.tenants.items = [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }];
        manager.tenants.selected = 'abc';
        wrapper.setProps({ manager });

        expect(wrapper.find('div.loader')).toHaveLength(0); // Loader not existing
        expect(wrapper.find('.dropdown.tenantsMenu')).toHaveLength(1); // Showing the tenatns menu
        expect(wrapper.find('.dropdown.tenantsMenu > span > span').text()).toBe('abc'); // Showing the default tenant (first one) if no 'selected one was stated'
        expect(wrapper.find('.tenantsMenu .menu .item')).toHaveLength(3); // Having 3 items in the dropdown
        expect(wrapper.find('.tenantsMenu .menu .item.selected')).toHaveLength(0);
    });

    it('onTenantChange is called', () => {
        const onTenantChange = sinon.spy();

        manager.tenants.isFetching = false;
        manager.tenants.items = [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }];
        manager.tenants.selected = 'abc';
        wrapper.setProps({ manager, onTenantChange });

        wrapper
            .find('.tenantsMenu .menu .item')
            .first()
            .simulate('click');
        expect(onTenantChange.calledOnce).toBe(true);
        expect(onTenantChange.calledWithExactly('aaa')).toBe(true);
    });
});
