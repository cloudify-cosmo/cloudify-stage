import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import type { EnvironmentRenderParams } from './EnvironmentHandler.types';

const templatePath = path.resolve(__dirname, '../templates/blueprints/environment.ejs');
const template = fs.readFileSync(templatePath, 'utf8');

export const renderBlueprint = (renderParams: EnvironmentRenderParams) => {
    return ejs.render(template, renderParams);
};
