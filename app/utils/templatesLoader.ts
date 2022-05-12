import { keyBy, mapValues } from 'lodash';
import log from 'loglevel';
import type { ManagerData } from '../reducers/managerReducer';
import Internal from './Internal';

function fetchResource(manager: ManagerData, resourceUrl = '') {
    return new Internal(manager).doGet(`/templates${resourceUrl}`).then(resources => keyBy(resources, 'id'));
}

export default function load(manager: ManagerData) {
    return Promise.all([
        fetchResource(manager),
        fetchResource(manager, '/pages'),
        fetchResource(manager, '/page-groups')
    ])
        .then(results => ({
            templatesDef: mapValues(results[0], 'data'),
            pagesDef: mapValues(results[1], ({ name, data }) => ({ name, ...data })),
            pageGroupsDef: mapValues(results[2], ({ name, icon, pages }) => ({ name, icon, pages }))
        }))
        .catch(e => log.error(e));
}
