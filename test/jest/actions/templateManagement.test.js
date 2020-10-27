import { createPageId } from 'actions/templateManagement';

describe('(Action) Template management', () => {
    it('creates new page id', () => {
        expect(createPageId('name', { name: null })).toBe('name2');
    });
});
