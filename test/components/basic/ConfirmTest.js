/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react'
import {mount} from 'enzyme'
import {expect} from 'chai';
import sinon from 'sinon';
import {Confirm} from '../../../app/components/basic';

describe('(Component) Confirm', () => {

    var wrapper;
    global.requestAnimationFrame = () => {};
    global.cancelAnimationFrame = () => {};

    before(() => {
        let div = $('<div />').appendTo('body');

        wrapper = mount(
            <Confirm content='test title' />, { attachTo: div.get(0) }
        );
    });

    it('renders...', () => {
        expect(wrapper).to.exist;
    });

    it('shows up', function () {
        wrapper.setProps({open:true});
        expect($('.confirmModal').parent().hasClass('active')).to.be.true;
        expect($('.confirmModal .content').text()).to.be.equal('test title');
    });

    it('clicks ok button', function(done) {
        this.timeout(10000);
        var cb = sinon.spy();
        wrapper.setProps({onConfirm:cb, onCancel:()=>{}});
        $('.confirmModal .actions .ui.button.primary').trigger( 'click' );
        expect(cb).to.have.been.calledOnce;
        done();
    });

    it('clicks cancel button', () => {
        var cb = sinon.spy();
        wrapper.setProps({onCancel:cb, onConfirm:()=>{}});
        $('.confirmModal .actions .ui.button').trigger( 'click' );
        expect(cb).to.have.been.calledOnce;
    });

    it('unmounts', () => {
        wrapper.unmount();
        expect($('.ui.dimmer .confirmModal').length > 0).to.be.false;
    });

    after(() => {
        wrapper.detach();
    });

});

