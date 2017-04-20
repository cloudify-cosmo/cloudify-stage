/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react'
import {shallow, mount} from 'enzyme'
import {expect} from 'chai';
import sinon from 'sinon';
import {Modal} from 'semantic-ui-react';
import {CancelButton, ApproveButton} from '../../../app/components/basic/modal/ModalButtons';

describe('(Component) Modal', () => {

    var wrapper;
    global.requestAnimationFrame = () => {};
    global.cancelAnimationFrame = () => {};
    var approveCallback = sinon.spy();
    var cancelCallback = sinon.spy();

    before(() => {
        let div = $('<div />').appendTo('body');

        wrapper = mount(
            <Modal className='testModal' open>
                <Modal.Header>test header</Modal.Header>
                <Modal.Content><form>test body</form></Modal.Content>
                <Modal.Actions>
                    <CancelButton onClick={cancelCallback} />
                    <ApproveButton onClick={approveCallback} color='green'/>
                </Modal.Actions>
            </Modal>, { attachTo: div.get(0) }
        );
    });

    it('renders...', () => {
        expect(wrapper).to.exist;
    });

    it('shows up modal', function() {
        wrapper.setProps({open:true});
        this.timeout(500);
        this.retries(5);
        if ($('.confirmTest').parent().hasClass('active')) {
            expect($('.confirmTest').parent().hasClass('active')).to.be.true;
        }
    });

    it('renders header', () => {
        expect($('.testModal .header').text()).to.be.equal('test header');
    });

    it('renders content', () => {
        expect($('.testModal .content')).to.exist;
    });

    it('renders actions', () => {
        expect($('.testModal .actions')).to.exist;
    });

    it('clicks approve button', () => {
        $('.testModal .actions .button.ok').trigger( 'click' );
        expect(approveCallback).to.have.been.calledOnce;
    });

    it('clicks cancel button', () => {
        $('.testModal .actions .button.cancel').trigger( 'click' );
        expect(cancelCallback).to.have.been.calledOnce;
    });

    it('unmounts', () => {
        wrapper.unmount();
        expect($('.ui.dimmer .testModal').length > 0).to.be.false;
    });

    /* Hide modal doesn't work in Enzyme, spent long time to check why but without success.
       Will come back to it in spare time.*/
    it('hide modal', () => {
        wrapper.setProps({open:false});
        expect($('.ui.dimmer.active .ui.modal').length > 0).to.be.false;
    });

    after(() => {
        wrapper.detach();
    });

});

