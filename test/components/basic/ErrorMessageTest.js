/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react'
import {shallow , mount} from 'enzyme'
import {expect} from 'chai';
import ErrorMessage from '../../../app/components/basic/ErrorMessage';

describe('(Component) ErrorMessage', () => {

    it("doesn't render if error empty",()=>{
        var wrapper = shallow(<ErrorMessage/>);

        expect(wrapper.find('div.error.message')).to.not.exist;
    });

    var wrapper = shallow(<ErrorMessage error="test" className="testClassName" header="test header" show={false}/>);
    it('renders if error not empty', () => {
        expect(wrapper).to.exist;
    });

    it('renders classname',()=>{
        expect(wrapper.find('div.error.message')).to.have.className('testClassName');
    });

    it('renders header name',()=>{
        expect(wrapper.find('div.header')).to.have.text('test header');
    });

    it('checks if hidden',()=>{
        expect(wrapper.find('div.error.message')).to.have.style("display", "none");
    });

});

