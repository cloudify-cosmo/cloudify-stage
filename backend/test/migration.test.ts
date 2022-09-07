// eslint-disable-next-line security/detect-child-process
import { execSync } from 'child_process';
import { existsSync, mkdirSync, renameSync, rmdirSync } from 'fs-extra';
import { join } from 'path';
import { noop } from 'lodash';

import { getConfig } from 'config';
import { getResourcePath } from '../utils';
import { iconFilename, iconsDirectory } from '../migrations/20220527182401-6_4-RemoveBlueprintAdditionsTable';

const latestMigration = '20220527182401-6_4-RemoveBlueprintAdditionsTable.js';
const userDataFolder = getResourcePath('', true);
const userDataBackupFolder = `${userDataFolder}-backup`;

describe('Migration script', () => {
    function execMigration(command: string) {
        return execSync(`ts-node migration ${command}`);
    }

    beforeAll(() => execMigration('up'));

    // Backup user templates for tests to restore later
    beforeAll(() => {
        // NOTE: make the directory just to ensure the rest of the backup code completes anyway
        mkdirSync(userDataFolder, { recursive: true });
        renameSync(userDataFolder, userDataBackupFolder);
    });
    afterAll(() => {
        rmdirSync(userDataFolder, { recursive: true });
        renameSync(userDataBackupFolder, userDataFolder);
    });

    beforeEach(() => execMigration('clear'));

    it('prints latest revision for "current" argument', () => {
        const result = execMigration('current').toString();
        expect(result).toEqual(`${latestMigration}\n`);
    });

    // eslint-disable-next-line jest/expect-expect
    it('handles migration down to the same version with no error', () => {
        execMigration(`downTo ${latestMigration}`);
    });

    function testMigrationUp(snapshotVersion: string, initialMigration: string, verifyMigration = noop) {
        // eslint-disable-next-line jest/expect-expect
        it(`migrates from ${snapshotVersion} snapshot`, () => {
            try {
                execMigration(`downTo ${initialMigration}`);
                execSync(
                    `psql ${
                        getConfig().app.db.url
                    } -v ON_ERROR_STOP=1 --single-transaction -f test/snapshots/${snapshotVersion}.sql`
                );
                execMigration('up');
            } catch (e: any) {
                console.log(`Error when migrating from ${initialMigration} for ${snapshotVersion}`);
                console.log(e.stdout.toString(), e.stderr.toString());

                throw e;
            }
            verifyMigration();
        });
    }

    testMigrationUp('4.5.5', '20171011082922-4_2-UserAppsRoleColumnRemoval.js');
    testMigrationUp('4.6', '20171011082922-4_2-UserAppsRoleColumnRemoval.js');
    testMigrationUp('5.0.5', '20190423064931-5_0-CreateWidgetBackendTable.js');
    testMigrationUp('5.1', '20200123095213-5_1-CreateBlueprintUserData.js');
    testMigrationUp('6.0', '20210519093609-6_0-UserAppsManagerIpColumnRemoval.js');
    testMigrationUp('6.3', '20210929110911-6_3-UserAppsPageGroups.js', () => {
        const iconsPath = getResourcePath(iconsDirectory, true);

        /* eslint-disable jest/no-standalone-expect */
        expect(existsSync(join(iconsPath, 'external_jpeg', iconFilename))).toEqual(true);
        expect(existsSync(join(iconsPath, 'external_png', iconFilename))).toEqual(true);
        expect(existsSync(join(iconsPath, 'local_gif', iconFilename))).toEqual(true);
        expect(existsSync(join(iconsPath, 'local_jpg', iconFilename))).toEqual(true);
        expect(existsSync(join(iconsPath, 'local_png', iconFilename))).toEqual(true);
        expect(existsSync(join(iconsPath, 'external_jpeg_relative_url', iconFilename))).toEqual(true);
        expect(existsSync(join(iconsPath, 'invalid_url', iconFilename))).toEqual(false);
        /* eslint-enable jest/no-standalone-expect */
    });
});
