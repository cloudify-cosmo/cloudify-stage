/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Statistic, Icon } from 'semantic-ui-react';
import KeyIndicator from '../../../app/components/basic/KeyIndicator';

describe('(Component) KeyIndicator', () => {
    let wrapper;
    before(() => {
        wrapper = mount(<KeyIndicator title="test title" icon="rocket" number={10} />);
    });

    it('renders...', () => {
        expect(wrapper).to.exist;
    });

    it('renders header', () => {
        expect(wrapper.find(Statistic.Label)).to.have.text('test title');
    });

    it('renders number', () => {
        expect(
            wrapper
                .find(Statistic.Value)
                .text()
                .trim()
        ).to.equal('10');
    });

    it('renders icon', () => {
        expect(wrapper.find(Icon)).to.have.className('rocket');
    });
});
