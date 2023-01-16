import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import Grid from 'components/widgetsPage/content/widgets/grid/Grid';
import { Provider } from 'react-redux';

describe('(Component) Grid', () => {
    function testGridRender(isEditMode: boolean) {
        const wrapper = shallow(
            <Provider store={configureMockStore()()}>
                <Grid isEditMode={isEditMode} onGridDataChange={() => {}}>
                    {[]}
                </Grid>
            </Provider>
        );

        expect(wrapper.find(Grid)).toHaveLength(1);
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
