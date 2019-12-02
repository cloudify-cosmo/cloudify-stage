/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import SystemStatusIcon from '../../app/components/status/SystemStatusIcon';
import * as BasicComponents from '../../app/components/basic';

describe('(Component) SystemStatusIcon', () => {
    let wrapper;
    let systemStatus;
    global.Stage = { Basic: BasicComponents };
    const { Icon } = Stage.Basic;

    beforeEach(() => {
        systemStatus = 'OK';

        wrapper = mount(<SystemStatusIcon systemStatus={systemStatus} />);
    });

    it('renders with available status ', () => {
        systemStatus = 'OK';
        wrapper.setProps({ systemStatus });
        expect(wrapper).to.have.length(1);
        expect(wrapper.find(Icon).instance().props.color).to.equal('green'); // Green icon
    });

    it('renders with unavailable status ', () => {
        systemStatus = 'Fail';
        wrapper.setProps({ systemStatus });
        expect(wrapper).to.have.length(1);
        expect(wrapper.find(Icon).instance().props.color).to.equal('red'); // Red icon
    });

    it('renders with no status ', () => {
        systemStatus = undefined;
        wrapper.setProps({ systemStatus });
        expect(wrapper).to.have.length(1);
        expect(wrapper.find(Icon).instance().props.color).to.equal('grey'); // Grey icon
    });

    it('renders with degraded status', () => {
        systemStatus = 'Degraded';
        wrapper.setProps({ systemStatus });
        expect(wrapper).to.have.length(1);
        expect(wrapper.find(Icon).instance().props.color).to.equal('yellow'); // Yellow icon
    });
});
