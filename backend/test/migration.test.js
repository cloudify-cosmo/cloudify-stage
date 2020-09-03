/**
 * Created by jakub.niezgoda on 07/05/2019.
 */

// eslint-disable-next-line security/detect-child-process
const { execSync } = require('child_process');
const config = require('../config').get();

describe('Migration script', () => {
    it('prints latest revision for "current" argument', () => {
        const result = execSync('node migration.js current').toString();
        expect(result).toEqual('20200123095213-5_1-CreateBlueprintUserData.js\n');
    });

    it('migrates from 4.5.5 snapshot', () => {
        execSync('node migration.js downTo 20171011082922-4_2-UserAppsRoleColumnRemoval.js');
        execSync(`psql ${config.app.db.url} -v ON_ERROR_STOP=1 --single-transaction -f test/snapshots/4.5.5.sql`);
        execSync('node migration.js up');
    });
});
