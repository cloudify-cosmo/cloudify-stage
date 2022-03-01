import { createPageId } from 'actions/templateManagement/pages';

describe('(Action) Template management', () => {
    it('creates new page id', () => {
        expect(createPageId('name', { name: { name: 'name', layout: [] } })).toBe('name2');
    });
});
