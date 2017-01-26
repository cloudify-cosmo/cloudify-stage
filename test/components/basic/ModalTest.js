/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react'
import {shallow, mount} from 'enzyme'
import {expect} from 'chai';
import sinon from 'sinon';
import Modal from '../../../app/components/basic/modal/Modal';

describe('(Component) Modal', () => {

    var wrapper;

    before(() => {
        let div = $('<div />').appendTo('body');

        wrapper = mount(
            <Modal className="testModal">
                <Modal.Header>test header</Modal.Header>
                <Modal.Body><form>test body</form></Modal.Body>
                <Modal.Footer>
                    <Modal.Cancel label="cancel" icon=""/>
                    <Modal.Approve label="ok" icon="" className="green"/>
                </Modal.Footer>
            </Modal>, { attachTo: div.get(0) }
        );
    });

    it('renders...', () => {
        expect(wrapper).to.exist;
    });

    it('renders header', () => {
        expect(wrapper.find('.testModal .header')).to.have.text('test header');
    });

    it('renders body', () => {
        expect(wrapper.find('.testModal .content')).to.have.exactly(1).descendants('form');
    });

    it('renders footer', () => {
        expect(wrapper.find('.testModal .actions')).to.have.exactly(2).descendants('.ui.button');
    });

    it('shows up the content', () => {
        wrapper.setProps({show:true});
        expect($('.ui.dimmer.active .testModal').length > 0).to.be.true;
    });

    it('clicks approve button', () => {
        var cb = sinon.spy();
        wrapper.setProps({onApprove:cb});
        $(".testModal .ok").trigger( "click" );
        expect(cb).to.have.been.calledOnce;
    });

    it('clicks deny button', () => {
        var cb = sinon.spy();
        wrapper.setProps({onDeny:cb});
        $(".testModal .cancel").trigger( "click" );
        expect(cb).to.have.been.calledOnce;
    });

    it('turns on loading mode', () => {
        wrapper.setProps({loading:true});
        expect(wrapper.find("form")).to.have.className('loading');
        expect(wrapper.find(".ok.button")).to.have.className('disabled');
        expect($('.testModal .ok.button').attr('disabled')).to.equal('disabled');
    });

    it('turns off loading mode', () => {
        wrapper.setProps({loading:false});
        expect(wrapper.find("form")).to.not.have.className('loading');
        expect(wrapper.find(".ok.button")).to.not.have.className('loading');
        expect(wrapper.find(".ok.button")).to.not.have.className('disabled');
        expect($('.testModal .ok.button').attr('disabled')).to.be.empty;
    });

    it('unmounts', () => {
        wrapper.unmount();
        expect($('.ui.dimmer .testModal').length > 0).to.be.false;
    });

    /* Hide modal doesn't work in Enzyme, spent long time to check why but without success.
       Will come back to it in spare time.
    it('hide modal', () => {
        wrapper.setProps({show:false});
        expect($('.ui.dimmer.active .ui.modal').length > 0).to.be.false;
    });*/

    after(() => {
        wrapper.detach();
    });

});

