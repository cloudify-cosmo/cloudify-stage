/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import SystemStatusIcon from '../../app/components/SystemStatusIcon';
import * as BasicComponents from '../../app/components/basic';

describe('(Component) SystemStatusIcon', () => {
    let maintenanceStatus;
    let systemStatus;
    let wrapper;
    global.Stage = { Basic: BasicComponents };
    const { Icon } = Stage.Basic;

    beforeEach(() => {
        maintenanceStatus = 'deactivated';
        systemStatus = 'OK';

        wrapper = mount(<SystemStatusIcon maintenanceStatus={maintenanceStatus} systemStatus={systemStatus} />);
    });

    it('renders with available status ', () => {
        systemStatus = 'OK';
        wrapper.setProps({ systemStatus, maintenanceStatus });
        expect(wrapper).to.have.length(1);
        expect(wrapper.find(Icon).instance().props.color).to.equal('green'); // Green icon
    });

    it('renders with unavailable status ', () => {
        systemStatus = 'Fail';
        wrapper.setProps({ systemStatus, maintenanceStatus });
        expect(wrapper).to.have.length(1);
        expect(wrapper.find(Icon).instance().props.color).to.equal('red'); // Red icon
    });

    it('renders with no status ', () => {
        systemStatus = undefined;
        wrapper.setProps({ systemStatus, maintenanceStatus });
        expect(wrapper).to.have.length(1);
        expect(wrapper.find(Icon).instance().props.color).to.equal('grey'); // Empty icon
    });

    it('renders with activated maintenance ', () => {
        systemStatus = 'OK';
        maintenanceStatus = 'activated';
        wrapper.setProps({ systemStatus, maintenanceStatus });
        expect(wrapper).to.have.length(1);
        expect(wrapper.find(Icon).instance().props.color).to.equal('yellow'); // Yellow icon
    });

    it('renders with activated maintenance and unavailable status', () => {
        systemStatus = 'Fail';
        maintenanceStatus = 'activated';
        wrapper.setProps({ systemStatus, maintenanceStatus });
        expect(wrapper).to.have.length(1);
        expect(wrapper.find(Icon).instance().props.color).to.equal('red'); // Red icon
    });
});
