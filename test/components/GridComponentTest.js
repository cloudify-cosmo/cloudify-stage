/**
 * Created by kinneretzin on 15/12/2016.
 */

import React from 'react'
import { shallow , mount} from 'enzyme'
import {expect} from 'chai';
import sinon from 'sinon';

import Grid from '../../app/components/layout/Grid';
import GridItem from '../../app/components/layout/GridItem';


describe('(Component) Grid ', () => {

    it('Renders Non-Edit mode',()=>{
        var wrapper = shallow(<Grid isEditMode={false} onGridDataChange={()=>{}}/>);

        expect(wrapper).to.have.length(1);
    });

    it('Renders Edit mode',()=>{
        var wrapper = shallow(<Grid isEditMode={true} onGridDataChange={()=>{}}/>);

        expect(wrapper).to.have.length(1);
    });


    it('Renders GridItems child nodes',()=>{
        var wrapper = shallow(<Grid isEditMode={false}
                                    onGridDataChange={()=>{}}>
                                <GridItem id='1a'/>
                                <GridItem id='1b'/>
                                <GridItem id='1c'/>
                            </Grid>);

        expect(wrapper.find(GridItem)).to.have.length(3);
    });

    it('Renders GridItems child nodes',()=>{
        var wrapper = shallow(<Grid isEditMode={false}
                                    onGridDataChange={()=>{}}>
            <GridItem id='1a'/>
            <GridItem id='1b'/>
            <div>Some other item1</div>
            <GridItem id='1c'/>
            <div>Some other item2</div>
        </Grid>);

        expect(wrapper.find(GridItem)).to.have.length(3);
        expect(wrapper.children()).to.have.length(3);
    });

});
