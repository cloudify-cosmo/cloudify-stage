/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react'
import {shallow, mount} from 'enzyme'
import {expect} from 'chai';
import sinon from 'sinon';
import Confirm from '../../../app/components/basic/Confirm';

describe('(Component) Confirm', () => {

    var wrapper;

    before(() => {
        let div = $('<div />').appendTo('body');

        wrapper = mount(
            <Confirm title="test title" className="confirmTest"></Confirm>, { attachTo: div.get(0) }
        );
    });

    it('renders...', () => {
        expect(wrapper).to.exist;
    });

    it('renders title', () => {
        expect(wrapper.find('.confirmTest .header')).to.have.text('test title');
    });

    it('shows up', () => {
        wrapper.setProps({show:true});
        expect($('.ui.dimmer.active .confirmTest').length > 0).to.be.true;
    });

    it('clicks ok button', function(done) {
        this.timeout(10000);
        var cb = sinon.spy();
        wrapper.setProps({onConfirm:cb});
        $(".confirmTest .ok").trigger( "click" );
        expect(cb).to.have.been.calledOnce;
        done();
    });

    it('clicks cancel button', () => {
        var cb = sinon.spy();
        wrapper.setProps({onCancel:cb});
        $(".confirmTest .cancel").trigger( "click" );
        expect(cb).to.have.been.calledOnce;
    });

    it('unmounts', () => {
        wrapper.unmount();
        expect($('.ui.dimmer .confirmTest').length > 0).to.be.false;
    });

    after(() => {
        wrapper.detach();
    });

});

