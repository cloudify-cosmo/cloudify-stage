/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react'
import { shallow , mount} from 'enzyme'
import {expect} from 'chai';
import sinon from 'sinon';
import Grid from '../../../app/components/basic/grid/GridTable';

describe('(Component) GridTable', () => {

    var wrapper;
    var fetchSpy = sinon.spy();
    var selectSpy = sinon.spy();
    before(()=>{
        let div = $('<div />').appendTo('body');

        wrapper = mount(
            <Grid.Table fetchData={fetchSpy} pageSize={25} sortColumn="col1" sortAscending={false}>
                <Grid.Column label="Column one" name="col1" width="60%"/>
                <Grid.Column label="Column two" width="40%"/>
                <Grid.Column label="Column three" show={false}/>
                {
                    [{k:1}, {k:2}, {k:3, s:true}, {k:4}, {k:5}].map((item)=> {
                        return (
                            <Grid.Row key={item.k} select={item.s} onClick={item.s?selectSpy:null}>
                                <Grid.Data>Data {item.k}.1</Grid.Data>
                                <Grid.Data>Data {item.k}.2</Grid.Data>
                                <Grid.Data>Data {item.k}.3</Grid.Data>
                            </Grid.Row>
                        )
                    })
                }
            </Grid.Table>, { attachTo: div.get(0) }
        );
    });

    it('renders...', () => {
        expect(wrapper).to.exist;
    });

    it('renders no data message if empty', () => {
        wrapper.setProps({totalSize:0});
        expect(wrapper.find(".gridTable .noDataRow")).to.have.length(1);
        expect(wrapper.find(".gridTable .noDataRow td")).to.have.text('No data available');
        expect(wrapper.find(".gridTable .gridPagination")).to.have.length(0);
    });

    it('renders data rows', () => {
        wrapper.setProps({totalSize:5});
        expect(wrapper.find(".gridTable tbody tr")).to.have.length(5);
        expect(wrapper.find(".gridTable .gridPagination")).to.have.length(1);
    });

    it('renders selected row', () => {
        expect(wrapper.find(".gridTable tr.active")).to.have.length(1);
        expect(wrapper.find(".gridTable tr.active").childAt(0)).to.have.text('Data 3.1');
        expect(wrapper.find(".gridTable tr.active").childAt(1)).to.have.text('Data 3.2');
    });

    it('clicks selected row', () => {
        wrapper.find(".gridTable tr.active").simulate('click');
        expect(selectSpy).to.have.been.calledOnce;
        selectSpy.reset();
    });

    it('renders column attributes', () => {
        const col = wrapper.find(".gridTable thead tr").childAt(0);
        expect(col).to.have.style("width", "60%");
        expect(col).to.have.text('Column one');
    });

    it('disables sort column when no name is provided', () => {
        expect(wrapper.find(".gridTable thead tr").childAt(1)).to.have.className('disabled');
    });

    it('sorts column by default props', () => {
        const col = wrapper.find(".gridTable thead tr").childAt(0);
        expect(col).to.have.className('sorted');
        expect(col).to.have.className('descending');
    });

    it('hides column', () => {
        expect(wrapper.find(".gridTable th")).to.have.length(2);
        expect(wrapper.find(".gridTable tbody").childAt(0).find("td")).to.have.length(2);
    });

    it('renders search box', () => {
        wrapper.setProps({searchable:false});
        expect(wrapper.find(".gridTable i.search")).to.have.length(0);
        wrapper.setProps({searchable:true});
        expect(wrapper.find(".gridTable i.search")).to.have.length(1);
    });

    it('sorts column on click', () => {
        wrapper.find(".gridTable thead tr").childAt(0).simulate('click');
        expect(fetchSpy).to.have.been.calledOnce;
        sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 1, pageSize: 25, searchText: "", sortAscending: true, sortColumn: "col1"}});
        fetchSpy.reset();

        wrapper.find(".gridTable thead tr").childAt(0).simulate('click');
        expect(fetchSpy).to.have.been.calledOnce;
        sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 1, pageSize: 25, searchText: "", sortAscending: false, sortColumn: "col1"}});
        fetchSpy.reset();
    });

    it('renders default page size', () => {
        expect(wrapper.find(".gridTable .gridPagination .dropdown .text")).to.have.text('25');

        let dropdownText = wrapper.find(".gridTable .gridPagination .selection.dropdown .menu").text();
        expect(wrapper.find(".gridTable .gridPagination").childAt(0).text().replace(dropdownText, "") ).to.be.equal("Page size: 25  1 to 5 of 5 entries");
    });

    it('changes page size', () => {
        $(".gridTable .gridPagination .selection.dropdown").dropdown("set value", "5");
        expect(fetchSpy).to.have.been.calledOnce;
        sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 1, pageSize: 5, searchText: "", sortAscending: false, sortColumn: "col1"}});
        expect(wrapper.find(".gridTable .gridPagination .dropdown .text")).to.have.text('5');
        fetchSpy.reset();
    });

    describe('renders paginator and', () => {

        it('tests paginator for single page', () => {
            wrapper.setProps({totalSize:5});
            expect(wrapper.find(".gridTable .pagination")).to.have.length(0);
        });

        it('tests paginator for pages count equals to default number of pages', () => {
            wrapper.setProps({totalSize:25});
            const pagination = wrapper.find(".gridTable .pagination");

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

            const pagination = wrapper.find(".gridTable .pagination");

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
            const pagination = wrapper.find(".gridTable .pagination");
            pagination.childAt(2).simulate('click');
            expect(fetchSpy).to.have.been.calledOnce;
            sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 2, pageSize: 5, searchText: "", sortAscending: false, sortColumn: "col1"}});
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
            const pagination = wrapper.find(".gridTable .pagination");

            pagination.childAt(7).simulate('click');
            expect(fetchSpy).to.have.been.calledOnce;
            sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 3, pageSize: 5, searchText: "", sortAscending: false, sortColumn: "col1"}});
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
            sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 2, pageSize: 5, searchText: "", sortAscending: false, sortColumn: "col1"}});
            fetchSpy.reset();

            expect(page3).to.have.text('3');
            expect(page3).to.not.have.className('active');

            expect(page2).to.have.text('2');
            expect(page2).to.have.className('active');
        });

        it('changes pages to middle position', () => {
            wrapper.setProps({totalSize:36});

            const pagination = wrapper.find(".gridTable .pagination");

            const page4 = pagination.childAt(4);
            page4.simulate('click');
            expect(fetchSpy).to.have.been.calledOnce;
            sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 4, pageSize: 5, searchText: "", sortAscending: false, sortColumn: "col1"}});
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

    });

    after(() => {
        wrapper.detach();
    });

});

