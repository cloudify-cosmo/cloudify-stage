/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react'
import { shallow , mount} from 'enzyme'
import {expect} from 'chai';
import sinon from 'sinon';
import Segment from '../../../app/components/basic/segment/SegmentList';

describe('(Component) SegmentList', () => {

    var wrapper;
    var fetchSpy = sinon.spy();
    var selectSpy = sinon.spy();
    before(()=>{
        let div = $('<div />').appendTo('body');

        wrapper = mount(
            <Segment.List fetchData={fetchSpy} pageSize={25} sortColumn="col1" sortAscending={false}>
                {
                    [{k:1}, {k:2}, {k:3, s:true}, {k:4}, {k:5}].map((item)=> {
                        return (
                            <Segment.Item key={item.k} select={item.s} onClick={item.s?selectSpy:null}>
                                <div>Data {item.k}</div>
                            </Segment.Item>
                        )
                    })
                }
            </Segment.List>, { attachTo: div.get(0) }
        );
    });

    it('renders...', () => {
        expect(wrapper).to.exist;
    });

    it('renders no data message if empty', () => {
        wrapper.setProps({totalSize:0});

        expect(wrapper.find(".segmentList .icon.message")).to.have.length(1);
        expect(wrapper.find(".segmentList .icon.message")).to.have.text('No data available');
        expect(wrapper.find(".segmentList .gridPagination")).to.have.length(0);
    });

    it('renders data rows', () => {
        wrapper.setProps({totalSize:5});
        expect(wrapper.find(".segmentList .segment")).to.have.length(5);
    });

    it('renders selected row', () => {
        expect(wrapper.find(".segmentList .secondary.inverted.segment")).to.have.length(1);
        expect(wrapper.find(".segmentList .secondary.inverted.segment").childAt(0)).to.have.text('Data 3');
    });

    it('clicks selected row', () => {
        wrapper.find(".segmentList .secondary.inverted.segment").simulate('click');
        expect(selectSpy).to.have.been.calledOnce;
        selectSpy.reset();
    });

    after(() => {
        wrapper.detach();
    });

});

