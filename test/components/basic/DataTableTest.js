/**
 * Created by pawelposel on 24/11/2016.
 */

import React from 'react'
import { shallow , mount} from 'enzyme'
import {expect} from 'chai';
import sinon from 'sinon';
import DataTable from '../../../app/components/basic/dataTable/DataTable';

describe('(Component) DataTable', () => {

    var wrapper;
    var fetchSpy = sinon.spy(() => Promise.resolve());
    var selectSpy = sinon.spy();
    before(()=>{
        let div = $('<div />').appendTo('body');

        wrapper = mount(
            <DataTable fetchData={fetchSpy} pageSize={25} sortColumn="col1" sortAscending={false}>
                <DataTable.Column label="Column one" name="col1" width="60%"/>
                <DataTable.Column label="Column two" width="40%"/>
                <DataTable.Column label="Column three" show={false}/>
                {
                    [{k:1}, {k:2}, {k:3, s:true}, {k:4}, {k:5}].map((item)=> {
                        return (
                            <DataTable.Row key={item.k} selected={item.s} onClick={item.s?selectSpy:null}>
                                <DataTable.Data>Data {item.k}.1</DataTable.Data>
                                <DataTable.Data>Data {item.k}.2</DataTable.Data>
                                <DataTable.Data>Data {item.k}.3</DataTable.Data>
                            </DataTable.Row>
                        )
                    })
                }
            </DataTable>, { attachTo: div.get(0) }
        );
    });

    it('renders...', () => {
        expect(wrapper).to.exist;
    });

    it('renders no data message if empty', () => {
        wrapper.setProps({totalSize:0});
        expect(wrapper.find('.gridTable .noDataRow')).to.have.length(1);
        expect(wrapper.find('.gridTable .noDataRow td')).to.have.text('No data available');
        expect(wrapper.find('.gridTable .gridPagination')).to.have.length(0);
    });

    it('renders data rows', () => {
        wrapper.setProps({totalSize:5});
        expect(wrapper.find('.gridTable tbody tr')).to.have.length(5);
    });

    it('renders selected row', () => {
        expect(wrapper.find('.gridTable tr.active')).to.have.length(1);
        expect(wrapper.find('.gridTable tr.active').childAt(0)).to.have.text('Data 3.1');
        expect(wrapper.find('.gridTable tr.active').childAt(1)).to.have.text('Data 3.2');
    });

    it('clicks selected row', () => {
        wrapper.find('.gridTable tr.active').simulate('click');
        expect(selectSpy).to.have.been.calledOnce;
        selectSpy.reset();
    });

    it('renders column attributes', () => {
        const col = wrapper.find('.gridTable thead tr').childAt(0);
        expect(col).to.have.style('width', '60%');
        expect(col).to.have.text('Column one');
    });

    it('disables sort column when no name is provided', () => {
        expect(wrapper.find('.gridTable thead tr').childAt(1)).to.have.className('disabled');
    });

    it('sorts column by default props', () => {
        const col = wrapper.find('.gridTable thead tr').childAt(0);
        expect(col).to.have.className('sorted');
        expect(col).to.have.className('descending');
    });

    it('hides column', () => {
        expect(wrapper.find('.gridTable th')).to.have.length(2);
        expect(wrapper.find('.gridTable tbody').childAt(0).find('td')).to.have.length(2);
    });

    it('renders search box', () => {
        wrapper.setProps({searchable:false});
        expect(wrapper.find('.gridTable i.search')).to.have.length(0);
        wrapper.setProps({searchable:true});
        expect(wrapper.find('.gridTable i.search')).to.have.length(1);
    });

    it('sorts column on click up', (done) => {
        var fetchSpy = sinon.spy(()=>done());
        wrapper.setProps({fetchData:fetchSpy});

        wrapper.find('.gridTable thead tr').childAt(0).simulate('click');
        expect(fetchSpy).to.have.been.calledOnce;
        sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 1, sortAscending: true, sortColumn: 'col1'}});
        fetchSpy.reset();
    });

    it('sorts column on click down', (done) => {
        var fetchSpy = sinon.spy(()=>done());
        wrapper.setProps({fetchData:fetchSpy});

        wrapper.find('.gridTable thead tr').childAt(0).simulate('click');
        expect(fetchSpy).to.have.been.calledOnce;
        sinon.assert.calledWith(fetchSpy, {gridParams: {currentPage: 1, sortAscending: false, sortColumn: 'col1'}});
        fetchSpy.reset();
    });

    after(() => {
        wrapper.detach();
    });

});

