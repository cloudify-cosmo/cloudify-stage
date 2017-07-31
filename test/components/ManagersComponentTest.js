/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai';
import Manager from '../../app/components/Manager.js';
import * as BasicComponents from '../../app/components/basic';

describe('(Component) Manager', () => {
    let manager;
    let wrapper;
    global.Stage = {Basic: BasicComponents};
    let {Icon} = Stage.Basic;

    beforeEach(() => {
        manager = {
            maintenance: 'deactivated'
        };

        wrapper = mount(<Manager manager={manager}/>);
    });

    it('renders manager component with available status ',()=>{
        manager.status = 'running';
        wrapper.setProps({manager: manager});
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).getNode().props.color).to.equal('green'); // Green icon
    });

    it('renders manager component with unavailable status ',()=>{
        manager.status = 'not-running';
        wrapper.setProps({manager: manager});
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).getNode().props.color).to.equal('red'); // Red icon
    });

    it('renders manager component with no status ',()=>{
        manager.status = undefined;
        wrapper.setProps({manager: manager});
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).getNode().props.color).to.equal('grey'); // Empty icon
    });

    it('renders manager component with activated maintenance ',()=>{
        manager.status = 'running';
        manager.maintenance = 'activated';
        wrapper.setProps({manager: manager});
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).getNode().props.color).to.equal('yellow'); // Yellow icon
    });

    it('renders manager component with activated maintenance and unavailable status',()=>{
        manager.status = 'not-running';
        manager.maintenance = 'activated';
        wrapper.setProps({manager: manager});
        expect(wrapper).to.have.length(1); // Showing manager component
        expect(wrapper.find(Icon).getNode().props.color).to.equal('red'); // Red icon
    });

});
