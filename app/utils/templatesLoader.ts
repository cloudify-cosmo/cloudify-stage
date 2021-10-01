import log from 'loglevel';
import { merge } from 'lodash';
import type { ManagerData } from '../reducers/managerReducer';
import Internal from './Internal';
import LoaderUtils from './LoaderUtils';

function fetchResource(manager: ManagerData, resourceUrl = '') {
    return new Internal(manager)
        .doGet(`/templates${resourceUrl}`)
        .then((resources: { id: string; custom: boolean }[]) =>
            Promise.all(
                resources.map(resource =>
                    LoaderUtils.fetchResource(`templates${resourceUrl}/${resource.id}.json`, resource.custom)
                        .then(resourceData => ({ [resource.id]: resourceData }))
                        .catch(e => {
                            throw new Error(`Error loading ${resource.id}: ${e}`);
                        })
                )
            ).then(data => merge({}, ...data))
        );
}

export default function load(manager: ManagerData) {
    return Promise.all([
        fetchResource(manager),
        fetchResource(manager, '/pages'),
        fetchResource(manager, '/page-groups')
    ])
        .then(data => ({ templatesDef: data[0], pagesDef: data[1], pageGroupsDef: data[2] }))
        .catch(e => log.error(e));
}
