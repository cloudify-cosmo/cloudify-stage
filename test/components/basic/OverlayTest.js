/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react'
import {shallow, mount} from 'enzyme'
import {expect} from 'chai';
import Overlay from '../../../app/components/basic/overlay/Overlay';
import OverlayAction from '../../../app/components/basic/overlay/OverlayAction';
import OverlayContent from '../../../app/components/basic/overlay/OverlayContent';

describe('(Component) Overlay', () => {

    var wrapper;

    before(() => {
        let div = $('<div />').appendTo('body');

        wrapper = mount(
            <Overlay className="testOverlay">
                <OverlayAction>icon</OverlayAction>
                <OverlayContent>test content</OverlayContent>
            </Overlay>, { attachTo: div.get(0) }
        );
    });

    it('renders...', () => {
        expect(wrapper).to.exist;
    });

    it('renders content', () => {
        expect(wrapper.find('.testOverlay .content')).to.have.text('test content');
    });

    it('shows modal', () => {
        wrapper.find(OverlayAction).simulate('click');

        expect($('.ui.dimmer.active .testOverlay').length > 0).to.be.true;
    });

    it('unmounts', () => {
        wrapper.unmount();
        expect($('.ui.dimmer .testOverlay').length > 0).to.be.false;
    });

    after(() => {
        wrapper.detach();
    });

});

