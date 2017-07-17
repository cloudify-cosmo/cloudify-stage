/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react'
import {shallow , mount} from 'enzyme'
import {expect} from 'chai';
import sinon from 'sinon';
import ErrorMessage from '../../../app/components/basic/ErrorMessage';
import { Message } from 'semantic-ui-react';

describe('(Component) ErrorMessage', () => {

    it('doesn\'t render if error empty',()=>{
        var wrapper = shallow(<ErrorMessage/>);

        expect(wrapper.find('<Message/>')).to.not.exist;
    });

    var wrapper = mount(<ErrorMessage error="test" className="testClassName" header="test header" />);
    it('renders if error not empty', () => {
        expect(wrapper).to.exist;
    });

    it('renders classname',()=>{
        expect(wrapper.find(Message).get(0).props.className).to.equal('testClassName');
    });

    it('renders header name',()=>{
        expect(wrapper.find(Message.Header).get(0).props.children).to.equal('test header');
    });

    it('checks if message dismissal works', () => {
        var onDismissCallback = sinon.spy();
        wrapper.setProps({onDismiss:onDismissCallback});
        wrapper.find('i.close.icon').first().simulate('click',1)
        expect(onDismissCallback).to.have.been.calledOnce;
    });

});

