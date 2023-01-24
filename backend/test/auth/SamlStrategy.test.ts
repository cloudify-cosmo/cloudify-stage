import fs from 'fs';
import samlStrategy from '../../auth/SamlStrategy';

jest.mock('fs');

describe('SamlStrategy', () => {
    it('should throw error when SAML certificate is not available', () => {
        (<jest.Mock>fs.readFileSync).mockImplementation(() => {
            throw Error();
        });
        expect(samlStrategy).toThrowError('Could not read SAML certificate [auth.certPath]');
    });
    it('should return new passport Strategy', () => {
        (<jest.Mock>fs.readFileSync).mockReturnValue('cert content');
        expect(samlStrategy()).toEqual(
            expect.objectContaining({
                _saml: expect.objectContaining({
                    options: expect.objectContaining({
                        cert: 'cert content',
                        path: '/auth/saml/callback'
                    })
                }),
                name: 'saml'
            })
        );
    });
});
