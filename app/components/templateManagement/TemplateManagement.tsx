import i18n from 'i18next';
import { filter, find, includes, isEmpty, map, pick, reject, without } from 'lodash';
import log from 'loglevel';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import type {
    GetPageGroupsResponse,
    GetPagesResponse,
    GetTemplatesResponse,
    PostPagesRequestBody,
    PostTemplatesRequestBody,
    PutTemplatesRequestBody
} from 'backend/routes/Templates.types';
import type { PageItem } from 'backend/handler/templates/types';
import Const from '../../utils/consts';
import { Breadcrumb, Button, Divider, ErrorMessage, Segment } from '../basic';
import type { Page } from './pages/Pages';
import Pages from './pages/Pages';
import type { Template } from './templates/Templates';
import Templates from './templates/Templates';
import { setTemplateManagementActive } from '../../actions/templateManagement';
import { selectHomePage } from '../../actions/pageMenu';
import Internal from '../../utils/Internal';
import { useBoolean, useErrors } from '../../utils/hooks';
import { addTemplate, editTemplate, removeTemplate } from '../../actions/templateManagement/templates';
import { addPage, removePage } from '../../actions/templateManagement/pages';
import type { PageGroup } from './pageGroups/PageGroups';
import PageGroups from './pageGroups/PageGroups';
import type { ReduxState } from '../../reducers';
import useCreatePageId from './pages/useCreatePageId';
import type { ReduxThunkDispatch } from '../../configureStore';

export default function TemplateManagement() {
    const dispatch: ReduxThunkDispatch = useDispatch();
    const createPageId = useCreatePageId();

    const [isLoading, setLoading, unsetLoading] = useBoolean(true);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [pageGroups, setPageGroups] = useState<PageGroup[]>([]);
    const { errors, setMessageAsError, clearErrors } = useErrors();

    const internal = useSelector((state: ReduxState) => new Internal(state.manager));
    const pageDefs = useSelector((state: ReduxState) => state.templates.pagesDef);
    const templateDefs = useSelector((state: ReduxState) => state.templates.templatesDef);
    const pageGroupDefs = useSelector((state: ReduxState) => state.templates.pageGroupsDef);
    const tenants = useSelector((state: ReduxState) => state.manager.tenants);

    function handleError(error: any) {
        log.error(error);
        setMessageAsError(error);
        unsetLoading();
    }

    function fetchData() {
        startLoading();
        return Promise.all([
            internal.doGet<GetTemplatesResponse>('/templates'),
            internal.doGet<GetPagesResponse>('/templates/pages'),
            internal.doGet<GetPageGroupsResponse>('/templates/page-groups')
        ])
            .then(data => {
                const selectedTemplate = find(templates, { selected: true });
                const selectedPage = find(pages, { selected: true });

                const [templateList, pageList, pageGroupList] = data;

                const preparedTemplates: Template[] = templateList.map(template => ({
                    ...template,
                    pages: templateDefs[template.id].pages,
                    selected: template.id === selectedTemplate?.id
                }));

                const preparedPages = pageList.map(page => ({
                    ...page,
                    ...pick(pageDefs[page.id], 'name', 'icon'),
                    templates: map(
                        filter(preparedTemplates, template => find(template.pages, { id: page.id, type: 'page' })),
                        'id'
                    ),
                    pageGroups: _(pageGroupDefs)
                        .pickBy(pageGroup => includes(pageGroup.pages, page.id))
                        .keys()
                        .value(),
                    selected: page.id === selectedPage?.id
                }));

                const preparedPageGroups = pageGroupList.map(pageGroup => ({
                    ...pageGroup,
                    ...pageGroupDefs[pageGroup.id],
                    templates: map(
                        filter(preparedTemplates, template =>
                            find(template.pages, { id: pageGroup.id, type: 'pageGroup' })
                        ),
                        'id'
                    )
                }));

                setTemplates(preparedTemplates);
                setPages(preparedPages);
                setPageGroups(preparedPageGroups);
                clearErrors();
                unsetLoading();
            })
            .catch(handleError)
            .finally(unsetLoading);
    }

    useEffect(() => {
        dispatch(setTemplateManagementActive(true));
        return (() => dispatch(setTemplateManagementActive(false))) as () => void;
    }, []);

    useEffect(() => {
        fetchData();
    }, [templateDefs, pageDefs, pageGroupDefs]);

    function setSelected<Item extends { id: string; selected: boolean }>(collection: Item[], id: string) {
        return map(collection, item => ({ ...item, selected: !item.selected && item.id === id }));
    }

    function onSelectTemplate({ id }: Template) {
        setTemplates(setSelected(templates, id));
    }

    function onSelectPage({ id }: Page) {
        setPages(setSelected(pages, id));
    }

    function startLoading() {
        setLoading();
        clearErrors();
    }

    function onCreateTemplate(
        templateName: string,
        templateRoles: string[],
        templateTenants: string[],
        templatePages: PageItem[]
    ) {
        startLoading();

        const body: PostTemplatesRequestBody = {
            id: templateName.trim(),
            data: {
                roles: templateRoles,
                tenants: templateTenants
            },
            pages: templatePages
        };

        return internal
            .doPost<never, PostTemplatesRequestBody>('/templates', { body })
            .then(() => dispatch(addTemplate(body.id, body.pages)))
            .catch(handleError);
    }

    function onDeleteTemplate(template: Template) {
        startLoading();

        return internal
            .doDelete(`/templates/${template.id}`)
            .then(() => dispatch(removeTemplate(template.id)))
            .catch(handleError);
    }

    function updateTemplate(body: PutTemplatesRequestBody) {
        startLoading();

        return internal
            .doPut<never, PutTemplatesRequestBody>('/templates', { body })
            .then(() => {
                dispatch(editTemplate(body.id, body.pages));
                if (body.oldId && body.oldId !== body.id) {
                    dispatch(removeTemplate(body.oldId));
                }
            })
            .catch(handleError);
    }

    function onModifyTemplate(
        item: Template,
        templateName: string,
        templateRoles: string[],
        templateTenants: string[],
        templatePages: PageItem[]
    ) {
        const template: PutTemplatesRequestBody = {
            oldId: item.id,
            id: templateName.trim(),
            data: {
                roles: templateRoles,
                tenants: isEmpty(templateTenants) ? [Const.DEFAULT_ALL] : templateTenants
            },
            pages: templatePages
        };

        return updateTemplate(template);
    }

    function onUpdateTemplate(template: Template) {
        return updateTemplate({ ...template, oldId: template.id });
    }

    function onRemoveTemplatePageMenuItem(template: Template, pageMenuItem: PageItem) {
        template.pages = reject(template.pages, pageMenuItem);

        return onUpdateTemplate(template);
    }

    function onRemoveTemplateRole(template: Template, role: string) {
        template.data.roles = without(template.data.roles, role);

        return onUpdateTemplate(template);
    }

    function onRemoveTemplateTenant(template: Template, tenant: string) {
        template.data.tenants = without(template.data.tenants, tenant);

        return onUpdateTemplate(template);
    }

    function onDeletePage(page: Page) {
        startLoading();
        return internal
            .doDelete(`/templates/pages/${page.id}`)
            .then(() => dispatch(removePage(page.id)))
            .catch(handleError);
    }

    function canDeletePage(page: Page) {
        return isEmpty(page.templates)
            ? null
            : i18n.t('templates.pageManagement.cantDelete', 'Page is used by the templates and cannot be deleted');
    }

    function onEditPage(page: Page) {
        return dispatch(push(`/page_edit/${page.id}`));
    }

    function onPreviewPage(page: Page) {
        return dispatch(push(`/page_preview/${page.id}`));
    }

    function onPageCreate(name: string) {
        startLoading();

        const pageId = createPageId(name);
        const body: PostPagesRequestBody = {
            id: pageId,
            name
        };

        return internal
            .doPost<never, PostPagesRequestBody>('/templates/pages', { body })
            .then(() => dispatch(addPage({ ...body, layout: [] })))
            .then(() => dispatch(push(`/page_edit/${pageId}`)))
            .catch(handleError);
    }

    function onClose() {
        return dispatch(selectHomePage());
    }

    return (
        <div className="main">
            <Segment basic loading={isLoading}>
                <div style={{ position: 'relative' }}>
                    <Breadcrumb>
                        <Breadcrumb.Section active>
                            {i18n.t('templates.breadcrumb', 'Template management')}
                        </Breadcrumb.Section>
                    </Breadcrumb>
                    <Button
                        content={i18n.t('templates.close', 'Close')}
                        basic
                        compact
                        floated="right"
                        icon="sign out"
                        onClick={onClose}
                        style={{ position: 'absolute', right: 0 }}
                    />
                </div>
                <Divider />

                <ErrorMessage error={errors} onDismiss={clearErrors} />

                <Templates
                    templates={templates}
                    tenants={tenants}
                    onSelectTemplate={onSelectTemplate}
                    onRemoveTemplatePage={onRemoveTemplatePageMenuItem}
                    onRemoveTemplateRole={onRemoveTemplateRole}
                    onRemoveTemplateTenant={onRemoveTemplateTenant}
                    onCreateTemplate={onCreateTemplate}
                    onModifyTemplate={onModifyTemplate}
                    onDeleteTemplate={onDeleteTemplate}
                />

                <Pages
                    pages={pages}
                    onSelectPage={onSelectPage}
                    onCreatePage={onPageCreate}
                    onDeletePage={onDeletePage}
                    onEditPage={onEditPage}
                    onPreviewPage={onPreviewPage}
                    onCanDeletePage={canDeletePage}
                />

                <PageGroups pageGroups={pageGroups} />
            </Segment>
        </div>
    );
}
