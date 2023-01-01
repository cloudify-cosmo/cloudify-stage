import type { SemanticICONS } from 'semantic-ui-react';
import { keyBy, mapValues } from 'lodash';
import log from 'loglevel';
import type { Page, PageGroup, Template } from 'backend/handler/templates/types';
import type { GetPageGroupsResponse, GetPagesResponse, GetTemplatesResponse } from 'backend/routes/Templates.types';
import type { ManagerData } from '../reducers/managerReducer';
import Internal from './Internal';
import type { SimpleWidgetObj } from '../actions/page';

// NOTE: Solution based on https://stackoverflow.com/questions/41253310/typescript-retrieve-element-type-information-from-array-type
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
export type LayoutTemplateDefinition = Template['data'];
export type LayoutPageDefinition = { name: Page['name'] } & Page<SimpleWidgetObj, SemanticICONS>['data'];
export type LayoutPageGroupDefinition = Pick<PageGroup<SemanticICONS>, 'name' | 'icon' | 'pages'>;
export interface LayoutDefinitions {
    templatesDef: Record<string, LayoutTemplateDefinition>;
    pagesDef: Record<string, LayoutPageDefinition>;
    pageGroupsDef: Record<string, LayoutPageGroupDefinition>;
}
export const emptyLayoutDefinitions = { templatesDef: {}, pagesDef: {}, pageGroupsDef: {} };

export default function fetchLayoutDefinitions(manager: ManagerData) {
    return Promise.all([
        fetchResource<Template>(manager),
        fetchResource<Page>(manager, '/pages'),
        fetchResource<PageGroup>(manager, '/page-groups')
    ])
        .then(
            results =>
                ({
                    templatesDef: mapValues(results[0], 'data'),
                    pagesDef: mapValues(results[1], ({ name, data }) => ({ name, ...data })),
                    pageGroupsDef: mapValues(results[2], ({ name, icon, pages }) => ({ name, icon, pages }))
                } as LayoutDefinitions)
        )
        .catch(e => {
            log.error(e);
            return emptyLayoutDefinitions;
        });
}
