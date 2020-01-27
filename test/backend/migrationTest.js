/**
 * Created by jakub.niezgoda on 07/05/2019.
 */

import { expect } from 'chai';
import { execSync } from 'child_process';

describe('(Backend) Migration script', () => {
    it('prints latest revision for "current" argument', () => {
        const result = execSync('cd backend && node migration.js current').toString();
        expect(result).to.equal('20200123095213-5_1-CreateBlueprintUserData.js\n');
    });
});
