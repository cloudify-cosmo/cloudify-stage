/**
 * Created by jakub.niezgoda on 07/05/2019.
 */

import { expect } from 'chai';
import { execSync } from 'child_process';

describe('(Backend) Migration script', () => {
    it('prints latest revision for "current" argument', () => {
        const result = execSync('cd backend && node migration.js current').toString();
        expect(result).to.equal('20190423064931-5_0-CreateWidgetBackendTable.js\n');
    });
});
