import { getConfig } from 'cloudify-ui-common-cypress/config';
// @ts-ignore Webpack config not in TS
import getWebpackConfig from './webpack.config';

export default getConfig('http://localhost:4000', getWebpackConfig({}, { mode: 'test' })[0]);
