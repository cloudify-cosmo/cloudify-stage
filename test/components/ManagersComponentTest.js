/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Manager from '../../app/components/Manager.js';
import * as BasicComponents from '../../app/components/basic';

describe('(Component) Manager', () => {
    let manager;
    let wrapper;
    global.Stage = { Basic: BasicComponents };
    const { Icon } = Stage.Basic;

    beforeEach(() => {
        manager = {
            maintenance: 'deactivated',
            status: { status: 'running' }
        };

        wrapper = mount(<Manager manager={manager} showServicesStatus={false} />);
    });

    it('renders manager component with available status ', () => {
        manager.status.status = 'running';
        wrapper.setProps({ manager });
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).instance().props.color).to.equal('green'); // Green icon
    });

    it('renders manager component with unavailable status ', () => {
        manager.status.status = 'not-running';
        wrapper.setProps({ manager });
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).instance().props.color).to.equal('red'); // Red icon
    });

    it('renders manager component with no status ', () => {
        manager.status.status = undefined;
        wrapper.setProps({ manager });
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).instance().props.color).to.equal('grey'); // Empty icon
    });

    it('renders manager component with activated maintenance ', () => {
        manager.status.status = 'running';
        manager.maintenance = 'activated';
        wrapper.setProps({ manager });
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).instance().props.color).to.equal('yellow'); // Yellow icon
    });

    it('renders manager component with activated maintenance and unavailable status', () => {
        manager.status.status = 'not-running';
        manager.maintenance = 'activated';
        wrapper.setProps({ manager });
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).instance().props.color).to.equal('red'); // Red icon
    });
});
