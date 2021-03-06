import React from 'react';
import { mount, shallow } from 'enzyme';

import Grid from 'components/layout/Grid';
import GridItem from 'components/layout/GridItem';

describe('(Component) Grid', () => {
    function testGridRender(isEditMode: boolean) {
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
        function renderGridItem(id: string) {
            return <GridItem id={id}>Grid Item {id}</GridItem>;
        }

        const wrapper = mount(
            <Grid isEditMode={false} onGridDataChange={() => {}}>
                {renderGridItem('1a')}
                {renderGridItem('1b')}
                <div>Some other item1</div>
                {renderGridItem('1c')}
                <div>Some other item2</div>
            </Grid>
        );

        expect(wrapper.find(GridItem)).toHaveLength(3);
        expect(wrapper.findWhere(node => node.text().includes('Some other item'))).toHaveLength(0);
    });
});
