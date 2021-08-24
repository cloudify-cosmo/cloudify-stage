import React from 'react';
import { shallow } from 'enzyme';

import Grid from 'components/layout/Grid';

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
});
