import { createPageId } from 'actions/templateManagement/pages';

describe('(Action) Template management', () => {
    it('creates new page id', () => {
        expect(
            createPageId('name', {
                name: {
                    name: 'name',
                    icon: 'git',
                    layout: [
                        {
                            type: 'widgets',
                            content: [
                                {
                                    name: 'testWidget',
                                    id: 'blabla',
                                    definition: 'testWidget',
                                    configuration: {},
                                    drillDownPages: {},
                                    height: 10,
                                    width: 10,
                                    x: 0,
                                    y: 0,
                                    maximized: false
                                }
                            ]
                        }
                    ]
                }
            })
        ).toBe('name2');
    });
});
