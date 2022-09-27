import { keyBy, mapValues } from 'lodash';
import log from 'loglevel';
import type { ManagerData } from '../reducers/managerReducer';
import Internal from './Internal';
import type { Page, PageGroup, Template } from '../../backend/handler/templates/types';
import type {
    GetPageGroupsResponse,
    GetPagesResponse,
    GetTemplatesResponse
} from '../../backend/routes/Templates.types';

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

function fetchResource<Resource extends ArrayElement<GetTemplatesResponse | GetPagesResponse | GetPageGroupsResponse>>(
    manager: ManagerData,
    resourceUrl = ''
): Promise<Record<string, Resource>> {
    return new Internal(manager)
        .doGet<Resource[]>(`/templates${resourceUrl}`)
        .then(resources => keyBy(resources, 'id'));
}

export default function load(manager: ManagerData) {
    return Promise.all([
        fetchResource<Template>(manager),
        fetchResource<Page>(manager, '/pages'),
        fetchResource<PageGroup>(manager, '/page-groups')
    ])
        .then(results => {
            return {
                templatesDef: mapValues(results[0], 'data'),
                pagesDef: mapValues(results[1], ({ name, data }) => ({ name, ...data })),
                pageGroupsDef: mapValues(results[2], ({ name, icon, pages }) => ({ name, icon, pages }))
            };
        })
        .catch(e => log.error(e));
}
