// eslint-disable-next-line security/detect-child-process
const { execSync } = require('child_process');

const config = require('../config').get();

const latestMigration = '20201030110539-5_1_1-MigratePageLayouts.js';

describe('Migration script', () => {
    beforeAll(() => execSync('node migration.js up'));

    beforeEach(() => execSync('node migration.js clear'));

    it('prints latest revision for "current" argument', () => {
        const result = execSync('node migration.js current').toString();
        expect(result).toEqual(`${latestMigration}\n`);
    });

    // eslint-disable-next-line jest/expect-expect
    it('handles migration down to the same version with no error', () => {
        execSync(`node migration.js downTo ${latestMigration}`);
    });

    function testMigrationUp(snapshotVersion, initialMigration) {
        // eslint-disable-next-line jest/expect-expect
        it(`migrates from ${snapshotVersion} snapshot`, () => {
            try {
                execSync(`node migration.js downTo ${initialMigration}`);
                execSync(
                    `psql ${config.app.db.url} -v ON_ERROR_STOP=1 --single-transaction -f test/snapshots/${snapshotVersion}.sql`
                );
                execSync('node migration.js up');
            } catch (e) {
                console.log(e.stdout.toString());
                throw e;
            }
        });
    }

    testMigrationUp('4.5.5', '20171011082922-4_2-UserAppsRoleColumnRemoval.js');
    testMigrationUp('4.6', '20171011082922-4_2-UserAppsRoleColumnRemoval.js');
    testMigrationUp('5.0.5', '20190423064931-5_0-CreateWidgetBackendTable.js');
    testMigrationUp('5.1', '20200123095213-5_1-CreateBlueprintUserData.js');
});
