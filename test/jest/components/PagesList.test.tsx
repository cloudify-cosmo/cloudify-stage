import React from 'react';
import { mount, shallow } from 'enzyme';

import sinon from 'sinon';

import PagesList from 'components/PagesList';
import Consts from 'utils/consts';
import { noop } from 'lodash';

import { Icon } from 'components/basic';
import AddPageButton from 'containers/AddPageButton';
import type { PageDefinition } from 'actions/page';

describe('(Component) PagesList', () => {
    const defaultProps = {
        onPageSelected: noop,
        onPageRemoved: noop,
        onPageReorder: noop,
        pages: [],
        selected: undefined,
        isEditMode: false
    };
    const samplePages: PageDefinition[] = [
        { id: 'abafar', type: 'page', name: 'Abafar', description: 'Abafar Planet', isDrillDown: false, layout: [] },
        {
            id: 'mustafar',
            type: 'page',
            name: 'Mustafar',
            description: 'Mustafar Planet',
            isDrillDown: false,
            layout: []
        }
    ];

    it('should render component', () => {
        const wrapper = mount(
            <PagesList
                onPageReorder={defaultProps.onPageReorder}
                onItemRemoved={defaultProps.onPageRemoved}
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
                onItemRemoved={defaultProps.onPageRemoved}
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

    it('should call onPageSelected callback after click the link', () => {
        const handlePageSelectedSpy = sinon.spy();
        const wrapper = mount(
            <PagesList
                onPageReorder={defaultProps.onPageReorder}
                onItemRemoved={defaultProps.onPageRemoved}
                onPageSelected={handlePageSelectedSpy}
                isEditMode={defaultProps.isEditMode}
                pages={samplePages}
            />
        );

        const menuItems = wrapper.find('a').first();

        expect(menuItems).toHaveLength(1);

        menuItems.simulate('click');

        expect(handlePageSelectedSpy.called).toBe(true);
        expect(handlePageSelectedSpy.getCall(0).args).toEqual([samplePages[0]]);
    });

    it('should render edit mode', () => {
        const wrapper = shallow(
            <PagesList
                onPageReorder={defaultProps.onPageReorder}
                onItemRemoved={defaultProps.onPageRemoved}
                onPageSelected={defaultProps.onPageSelected}
                isEditMode
                pages={samplePages}
            />
        );

        expect(wrapper.find(Icon)).toHaveLength(2);
        expect(wrapper.find(AddPageButton)).toHaveLength(1);
    });
});
