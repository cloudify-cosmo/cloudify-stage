/**
 * Created by jakub.niezgoda on 07/05/2019.
 */

const { execSync } = require('child_process');
const { mkdirSync } = require('fs');

const config = require('../config').get();
const { getResourcePath } = require('../utils');

describe('Migration script', () => {
    beforeAll(() => {
        execSync('node migration.js clear');
        execSync('node migration.js up');
    });

    it('prints latest revision for "current" argument', () => {
        const result = execSync('node migration.js current').toString();
        expect(result).toEqual('20200123095213-5_1-CreateBlueprintUserData.js\n');
    });

    it('migrates from 4.5.5 snapshot', async () => {
        try {
            execSync('node migration.js downTo 20171011082922-4_2-UserAppsRoleColumnRemoval.js');
            execSync(`psql ${config.app.db.url} -v ON_ERROR_STOP=1 --single-transaction -f test/snapshots/4.5.5.sql`);
            execSync('node migration.js up');
        } catch (e) {
            console.log(e.stdout.toString());
            throw e;
        }
    });
});
