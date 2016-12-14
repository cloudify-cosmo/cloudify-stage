/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react'
import { shallow , mount} from 'enzyme'
import {expect} from 'chai';
import KeyIndicator from '../../../app/components/basic/KeyIndicator';

describe('(Component) KeyIndicator', () => {

    var wrapper;
    before(()=>{
        wrapper = shallow(<KeyIndicator title="test title" icon="rocket" number={10}/>);
    });

    it('renders...', () => {
        expect(wrapper).to.exist;
    });

    it('renders header',()=>{
        expect(wrapper.find('.keyIndicator .label')).to.have.text('test title');
    });

    it('renders number',()=>{
        expect(wrapper.find('.keyIndicator .value').text().trim()).to.equal('10');
    });

    it('renders icon',()=>{
        expect(wrapper.find('.keyIndicator i.icon')).to.have.className('rocket');
    });

});

