/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Checkmark from '../../../app/components/basic/Checkmark';

describe('(Component) Checkmark', () => {
    let wrapper;
    before(() => {
        wrapper = mount(<Checkmark value />);
    });

    it('renders...', () => {
        expect(wrapper).to.exist;
    });

    it('shows icon for true value', () => {
        expect(wrapper.find('i.checkmark.icon')).to.exist;
    });

    it('shows square icon for false value', () => {
        const wrapper = mount(<Checkmark value={false} />);
        expect(wrapper.find('i.square.outline.icon')).to.exist;
    });
});
