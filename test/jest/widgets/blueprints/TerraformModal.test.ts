import { getResourceLocation } from 'blueprints/src/TerraformModal';

describe('(Widget) Blueprints', () => {
    describe('should provide Terraform resource location', () => {
        it('for multiple modules', () => {
            const location = 'dir1';
            const resourceLocation = getResourceLocation([location, 'dir2'], location);
            expect(resourceLocation).toBe(location);
        });
        it('for single module and nested path', () => {
            const location = 'dir1/dir2';
            expect(getResourceLocation([location], location)).toBe('dir2');
        });
        it('for single module and single level path', () => {
            const location = 'dir1';
            expect(getResourceLocation([location], location)).toBe('');
        });
    });
});
