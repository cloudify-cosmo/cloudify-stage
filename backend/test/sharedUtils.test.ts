import { isYamlFile } from 'sharedUtils';

describe('Shared utils', () => {
    it('should determine yaml file', () => {
        expect(isYamlFile('test.yaml')).toBeTruthy();
        expect(isYamlFile('test.YAML')).toBeTruthy();
        expect(isYamlFile('test.yml')).toBeTruthy();

        expect(isYamlFile('test.tgz')).toBeFalsy();
    });
});
