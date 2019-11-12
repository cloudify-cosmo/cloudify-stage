/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Manager from '../../app/components/Manager';
import * as BasicComponents from '../../app/components/basic';

describe('(Component) Manager', () => {
    let maintenanceStatus;
    let managerStatus;
    let wrapper;
    global.Stage = { Basic: BasicComponents };
    const { Icon } = Stage.Basic;

    beforeEach(() => {
        maintenanceStatus = 'deactivated';
        managerStatus = 'OK';

        wrapper = mount(
            <Manager maintenanceStatus={maintenanceStatus} managerStatus={managerStatus} showServicesStatus={false} />
        );
    });

    it('renders manager component with available status ', () => {
        managerStatus = 'OK';
        wrapper.setProps({ managerStatus, maintenanceStatus });
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).instance().props.color).to.equal('green'); // Green icon
    });

    it('renders manager component with unavailable status ', () => {
        managerStatus = 'FAIL';
        wrapper.setProps({ managerStatus, maintenanceStatus });
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).instance().props.color).to.equal('red'); // Red icon
    });

    it('renders manager component with no status ', () => {
        managerStatus = undefined;
        wrapper.setProps({ managerStatus, maintenanceStatus });
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).instance().props.color).to.equal('grey'); // Empty icon
    });

    it('renders manager component with activated maintenance ', () => {
        managerStatus = 'OK';
        maintenanceStatus = 'activated';
        wrapper.setProps({ managerStatus, maintenanceStatus });
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).instance().props.color).to.equal('yellow'); // Yellow icon
    });

    it('renders manager component with activated maintenance and unavailable status', () => {
        managerStatus = 'FAIL';
        maintenanceStatus = 'activated';
        wrapper.setProps({ managerStatus, maintenanceStatus });
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).instance().props.color).to.equal('red'); // Red icon
    });
});
