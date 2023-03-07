import { getConfig } from 'cloudify-ui-common-cypress/config';
import getWebpackConfig from './webpack.config';

export default getConfig('http://localhost:4000', getWebpackConfig({}, { mode: 'test' })[0]);
