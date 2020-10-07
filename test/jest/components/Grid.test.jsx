/**
 * Created by kinneretzin on 15/12/2016.
 */

import React from 'react';
import { shallow } from 'enzyme';

import Grid from 'components/layout/Grid';
import GridItem from 'components/layout/GridItem';

describe('(Component) Grid ', () => {
    function testGridRender(isEditMode) {
        const wrapper = shallow(
            <Grid isEditMode={isEditMode} onGridDataChange={() => {}}>
                {[]}
            </Grid>
        );

        expect(wrapper).toHaveLength(1);
    }

    // eslint-disable-next-line jest/expect-expect
    it('Renders Non-Edit mode', () => {
        testGridRender(false);
    });

    // eslint-disable-next-line jest/expect-expect
    it('Renders Edit mode', () => {
        testGridRender(true);
    });

    it('Renders GridItems child nodes', () => {
        function renderGridItem(id) {
            return <GridItem id={id}>{[]}</GridItem>;
        }

        const wrapper = shallow(
            <Grid isEditMode={false} onGridDataChange={() => {}}>
                {renderGridItem('1a')}
                {renderGridItem('1b')}
                <div>Some other item1</div>
                {renderGridItem('1c')}
                <div>Some other item2</div>
            </Grid>
        );

        expect(wrapper.find(GridItem)).toHaveLength(3);
        expect(wrapper.children()).toHaveLength(3);
    });
});
