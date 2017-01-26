/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react'
import { shallow , mount} from 'enzyme'
import {expect} from 'chai';
import sinon from 'sinon';
import Pagination from '../../../app/components/basic/pagination/Pagination';

describe('(Component) Pagination', () => {

    var wrapper;
    var fetchSpy = sinon.spy();
    var selectSpy = sinon.spy();
    before(()=>{
        let div = $('<div />').appendTo('body');

        wrapper = mount(
            <Pagination fetchData={fetchSpy} pageSize={25}/>, { attachTo: div.get(0) }
        );
    });

    it('renders default page size', () => {
        wrapper.setProps({totalSize:10});
        wrapper.setProps({pageSize:5});

        expect(wrapper.find(".gridPagination .dropdown .text")).to.have.text('5');
        let dropdownText = wrapper.find(".gridPagination .selection.dropdown .menu").text();
        let infoText = wrapper.find(".gridPagination").childAt(0).text();
        //remove concatenated options values either from <select> and corresponding <divs> elements
        infoText = infoText.replace(dropdownText, "").replace(dropdownText, "");

        expect(infoText.replace(dropdownText, "").replace(dropdownText, "")).to.be.equal("Page size: 5  1 to 5 of 10 entries");
    });

    it('changes page size', () => {
        $(".gridPagination .selection.dropdown").dropdown("set value", "5");
        expect(fetchSpy).to.have.been.calledOnce;
        sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 1, pageSize: 5}});
        expect(wrapper.find(".gridPagination .dropdown .text")).to.have.text('5');
        fetchSpy.reset();
    });

    it('tests paginator for single page', () => {
        wrapper.setProps({totalSize:5});
        expect(wrapper.find(".gridPagination")).to.have.length(0);
        wrapper.setProps({totalSize:7});
        expect(wrapper.find(".gridPagination")).to.have.length(1);
    });

    it('tests paginator for pages count equals to default number of pages', () => {
        wrapper.setProps({totalSize:25});
        const pagination = wrapper.find(".pagination");

        const page0 = pagination.childAt(0);
        expect(page0).to.have.className('icon');
        expect(page0).to.have.className('disabled');

        const page1 = pagination.childAt(1);
        expect(page1).to.have.className('active');
        expect(page1).to.have.text('1');

        expect(pagination.childAt(5)).to.have.text('5');

        const page6 = pagination.childAt(6);
        expect(page6).to.have.className('icon');
        expect(page6).to.not.have.className('disabled');
    });

    it('tests paginator for more then default number of pages', () => {
        wrapper.setProps({totalSize:36});

        const pagination = wrapper.find(".pagination");

        const page0 = pagination.childAt(0);
        expect(page0).to.have.className('icon');
        expect(page0).to.have.className('disabled');

        const page1 = pagination.childAt(1);
        expect(page1).to.have.text('1');
        expect(page1).to.have.className('active');

        const page5 = pagination.childAt(5);
        expect(page5).to.have.text('...');
        expect(page5).to.have.className('disabled');

        expect(pagination.childAt(6)).to.have.text('8');

        const page7 = pagination.childAt(7);
        expect(page7).to.have.className('icon');
        expect(page7).to.not.have.className('disabled');
    });

    it('selects next page', () => {
        const pagination = wrapper.find(".pagination");
        pagination.childAt(2).simulate('click');
        expect(fetchSpy).to.have.been.calledOnce;
        sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 2, pageSize: 5}});
        fetchSpy.reset();

        const page0 = pagination.childAt(0);
        expect(page0).to.have.className('icon');
        expect(page0).to.not.have.className('disabled');

        const page1 = pagination.childAt(1);
        expect(page1).to.have.text('1');
        expect(page1).to.not.have.className('active');

        const page2 = pagination.childAt(2);
        expect(page2).to.have.text('2');
        expect(page2).to.have.className('active');

        const page5 = pagination.childAt(5);
        expect(page5).to.have.text('...');
        expect(page5).to.have.className('disabled');

        expect(pagination.childAt(6)).to.have.text('8');

        const page7 = pagination.childAt(7);
        expect(page7).to.have.className('icon');
        expect(page7).to.not.have.className('disabled');
    });

    it('changes pages by arrows', () => {
        const pagination = wrapper.find(".pagination");

        pagination.childAt(7).simulate('click');
        expect(fetchSpy).to.have.been.calledOnce;
        sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 3, pageSize: 5}});
        fetchSpy.reset();

        const page0 = pagination.childAt(0);
        expect(page0).to.have.className('icon');
        expect(page0).to.not.have.className('disabled');

        const page2 = pagination.childAt(2);
        expect(page2).to.have.text('2');
        expect(page2).to.not.have.className('active');

        const page3 = pagination.childAt(3);
        expect(page3).to.have.text('3');
        expect(page3).to.have.className('active');

        pagination.childAt(0).simulate('click');
        expect(fetchSpy).to.have.been.calledOnce;
        sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 2, pageSize: 5}});
        fetchSpy.reset();

        expect(page3).to.have.text('3');
        expect(page3).to.not.have.className('active');

        expect(page2).to.have.text('2');
        expect(page2).to.have.className('active');
    });

    it('changes pages to middle position', () => {
        wrapper.setProps({totalSize:36});

        const pagination = wrapper.find(".pagination");

        const page4 = pagination.childAt(4);
        page4.simulate('click');
        expect(fetchSpy).to.have.been.calledOnce;
        sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 4, pageSize: 5}});
        fetchSpy.reset();

        const page0 = pagination.childAt(0);
        expect(page0).to.have.className('icon');
        expect(page0).to.not.have.className('disabled');

        expect(pagination.childAt(2)).to.have.text('2');

        expect(page4).to.have.text('4');
        expect(page4).to.have.className('active');

        const page6 = pagination.childAt(6);
        expect(page6).to.have.text('...');
        expect(page6).to.have.className('disabled');

        const page8 = pagination.childAt(8);
        expect(page8).to.have.className('icon');
        expect(page8).to.not.have.className('disabled');
    });

    after(() => {
        wrapper.detach();
    });

});

