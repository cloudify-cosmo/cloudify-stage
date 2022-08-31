import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { createBlueprintAdditionsModel } from './20170425132017-4_0-init';
import type { MigrationObject } from './common/types';
import BlueprintAdditions from '../db/models/BlueprintAdditionsModel';
import { getResourcePath } from '../utils';

export const iconsDirectory = 'blueprint-icons';
export const iconFilename = 'icon.png';

export const { up, down }: MigrationObject = {
    up: async (queryInterface, Sequelize, logger) => {
        const blueprintAdditions = await BlueprintAdditions(queryInterface.sequelize, Sequelize).findAll();
        const externalContentPrefix = '/console/external/content?url=';

        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < blueprintAdditions.length; i += 1) {
            const { blueprintId, image } = blueprintAdditions[i];
            let { imageUrl } = blueprintAdditions[i];
            const iconPath = getResourcePath(path.join(iconsDirectory, blueprintId), true);

            logger.info(`Migrating icon for '${blueprintId}' blueprint...`);
            try {
                let imageBuffer: Buffer = image;
                if (imageUrl) {
                    // NOTE: In old Cloudify versions `imageUrl` was defined as relative URL
                    //       using `/console/external` endpoint
                    if (imageUrl.startsWith(externalContentPrefix)) {
                        imageUrl = decodeURIComponent(imageUrl.replace(externalContentPrefix, ''));
                    }
                    logger.info(`Fetching icon from URL: ${imageUrl}...`);
                    imageBuffer = (await axios.get(imageUrl, { responseType: 'arraybuffer' })).data;
                }
                await fs.promises.mkdir(iconPath, { recursive: true });
                await sharp(imageBuffer).toFile(path.join(iconPath, iconFilename));
                logger.info('Icon migration finished successfully.');
            } catch (error) {
                logger.error('Icon migration failed.', error);
            }
        }
        /* eslint-enable no-await-in-loop */

        return queryInterface
            .dropTable('BlueprintAdditions')
            .then(() => queryInterface.removeIndex('BlueprintAdditions', ['blueprintId'], { type: 'UNIQUE' }));
    },

    down: (queryInterface, Sequelize) => createBlueprintAdditionsModel(queryInterface, Sequelize)
};
