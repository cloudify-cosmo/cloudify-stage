import { getLogger } from '../LoggerHandler';

export default () => (category = '') => getLogger(`WidgetBackend${category ? `-${category}` : ''}`);
