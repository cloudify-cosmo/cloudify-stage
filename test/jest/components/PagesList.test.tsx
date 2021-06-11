import React from 'react';
import { mount } from 'enzyme';

// necessary by jquery-ui/ui/widgets/sortable
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/mouse';

import PagesList, { Page } from 'components/PagesList';
import Consts from 'utils/consts';
import { noop } from 'lodash';

describe('(Component) PagesList', () => {
    const defaultProps = {
        onPageSelected: noop,
        onPageRemoved: noop,
        onPageReorder: noop,
        pages: [],
        selected: undefined,
        isEditMode: false
    };
    const samplePages: Page[] = [
        { id: 'abafar', name: 'Abafar', isDrillDown: false, tabs: [], widgets: [] },
        { id: 'mustafar', name: 'Mustafar', isDrillDown: false, tabs: [], widgets: [] }
    ];

    it('should render component', () => {
        const wrapper = mount(
            <PagesList
                onPageReorder={defaultProps.onPageReorder}
                onPageRemoved={defaultProps.onPageRemoved}
                onPageSelected={defaultProps.onPageSelected}
                isEditMode={defaultProps.isEditMode}
                pages={defaultProps.pages}
            />
        );

        expect(wrapper).toHaveLength(1);
    });

    it('should render menu item as link', () => {
        const wrapper = mount(
            <PagesList
                onPageReorder={defaultProps.onPageReorder}
                onPageRemoved={defaultProps.onPageRemoved}
                onPageSelected={defaultProps.onPageSelected}
                isEditMode={defaultProps.isEditMode}
                pages={samplePages}
            />
        );

        const menuItems = wrapper.find('a');

        expect(menuItems).toHaveLength(samplePages.length);
        expect(menuItems.at(0).prop('href')).toBe(`${Consts.CONTEXT_PATH}/page/${samplePages[0].id}`);
        expect(menuItems.at(1).prop('href')).toBe(`${Consts.CONTEXT_PATH}/page/${samplePages[1].id}`);
    });
});
