// @ts-nocheck File not migrated fully to TS
import i18n from 'i18next';
import _ from 'lodash';
import log from 'loglevel';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import Const from '../../utils/consts';
import { Breadcrumb, Button, Divider, ErrorMessage, Segment } from '../basic';
import Pages from './pages/Pages';
import Templates from './templates/Templates';
import { setTemplateManagementActive } from '../../actions/templateManagement';
import { selectHomePage } from '../../actions/pageMenu';
import Internal from '../../utils/Internal';
import { useBoolean, useErrors } from '../../utils/hooks';
import { addTemplate, editTemplate, removeTemplate } from '../../actions/templateManagement/templates';
import { addPage, removePage } from '../../actions/templateManagement/pages';
import PageGroups from './pageGroups/PageGroups';
import { ReduxState } from '../../reducers';
import useCreatePageId from './pages/useCreatePageId';

export default function TemplateManagement() {
    const dispatch = useDispatch();
    const createPageId = useCreatePageId();

    const [isLoading, setLoading, unsetLoading] = useBoolean(true);
    const [templates, setTemplates] = useState();
    const [pages, setPages] = useState();
    const [pageGroups, setPageGroups] = useState();
    const { errors, setMessageAsError, clearErrors } = useErrors();

    const internal = useSelector((state: ReduxState) => new Internal(state.manager));
    const pageDefs = useSelector((state: ReduxState) => state.templates.pagesDef);
    const templateDefs = useSelector((state: ReduxState) => state.templates.templatesDef);
    const pageGroupDefs = useSelector((state: ReduxState) => state.templates.pageGroupsDef);
    const tenants = useSelector((state: ReduxState) => state.manager.tenants);

    function handleError(err) {
        log.error(err);
        setMessageAsError(err);
        unsetLoading();
    }

    function fetchData() {
        startLoading();
        return Promise.all([
            internal.doGet('/templates'),
            internal.doGet('/templates/pages'),
            internal.doGet('/templates/page-groups')
        ])
            .then(data => {
                const selectedTemplate = _.find(templates, { selected: true });
                const selectedPage = _.find(pages, { selected: true });

                const [templateList, pageList, pageGroupList] = data;

                const preparedTemplates = _.map(templateList, template => {
                    return { ...template, pages: templateDefs[template.id].pages };
                });
                if (selectedTemplate) {
                    (_.find(preparedTemplates, { id: selectedTemplate.id }) || {}).selected = true;
                }

                const preparedPages = _.map(pageList, page => {
                    return {
                        ...page,
                        ..._.pick(pageDefs[page.id], 'name', 'icon'),
                        templates: _.map(
                            _.filter(preparedTemplates, template =>
                                _.find(template.pages, { id: page.id, type: 'page' })
                            ),
                            'id'
                        ),
                        pageGroups: _(pageGroupDefs)
                            .pickBy(pageGroup => _.includes(pageGroup.pages, page.id))
                            .keys()
                            .value()
                    };
                });
                if (selectedPage) {
                    (_.find(preparedPages, { id: selectedPage.id }) || {}).selected = true;
                }

                const preparedPageGroups = pageGroupList.map(pageGroup => ({
                    ...pageGroup,
                    ...pageGroupDefs[pageGroup.id],
                    templates: _.map(
                        _.filter(preparedTemplates, template =>
                            _.find(template.pages, { id: pageGroup.id, type: 'pageGroup' })
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
        return () => dispatch(setTemplateManagementActive(false));
    }, []);

    useEffect(() => {
        fetchData();
    }, [templateDefs, pageDefs, pageGroupDefs]);

    function setSelected(collection, id) {
        return _.map(collection, item => ({ ...item, selected: !item.selected && item.id === id }));
    }

    function onSelectTemplate({ id }) {
        setTemplates(setSelected(templates, id));
    }

    function onSelectPage({ id }) {
        setPages(setSelected(pages, id));
    }

    function startLoading() {
        setLoading();
        clearErrors();
    }

    function onCreateTemplate(templateName, templateRoles, templateTenants, templatePages) {
        startLoading();

        const body = {
            id: templateName.trim(),
            data: {
                roles: templateRoles,
                tenants: templateTenants
            },
            pages: templatePages
        };

        return internal
            .doPost('/templates', { body })
            .then(() => dispatch(addTemplate(body.id, body.pages)))
            .catch(handleError);
    }

    function onDeleteTemplate(template) {
        startLoading();

        return internal
            .doDelete(`/templates/${template.id}`)
            .then(() => dispatch(removeTemplate(template.id)))
            .catch(handleError);
    }

    function updateTemplate(body) {
        startLoading();

        return internal
            .doPut('/templates', { body })
            .then(() => {
                dispatch(editTemplate(body.id, body.pages));
                if (body.oldId && body.oldId !== body.id) {
                    dispatch(removeTemplate(body.oldId));
                }
            })
            .catch(handleError);
    }

    function onModifyTemplate(item, templateName, templateRoles, templateTenants, templatePages) {
        const template = {
            oldId: item.id,
            id: templateName.trim(),
            data: {
                roles: templateRoles,
                tenants: _.isEmpty(templateTenants) ? [Const.DEFAULT_ALL] : templateTenants
            },
            pages: templatePages
        };

        return updateTemplate(template);
    }

    function onUpdateTemplate(template) {
        return updateTemplate({ ...template, oldId: template.id });
    }

    function onRemoveTemplatePageMenuItem(template, pageMenuItem) {
        template.pages = _.reject(template.pages, pageMenuItem);

        return onUpdateTemplate(template);
    }

    function onRemoveTemplateRole(template, role) {
        template.data.roles = _.without(template.data.roles, role);

        return onUpdateTemplate(template);
    }

    function onRemoveTemplateTenant(template, tenant) {
        template.data.tenants = _.without(template.data.tenants, tenant);

        return onUpdateTemplate(template);
    }

    function onDeletePage(page) {
        startLoading();
        return internal
            .doDelete(`/templates/pages/${page.id}`)
            .then(() => dispatch(removePage(page.id)))
            .catch(handleError);
    }

    function canDeletePage(page) {
        return _.isEmpty(page.templates)
            ? null
            : i18n.t('templates.pageManagement.cantDelete', 'Page is used by the templates and cannot be deleted');
    }

    function onEditPage(page) {
        return dispatch(push(`/page_edit/${page.id}`));
    }

    function onPreviewPage(page) {
        return dispatch(push(`/page_preview/${page.id}`));
    }

    function onPageCreate(name) {
        startLoading();

        const pageId = createPageId(name);
        const body = {
            id: pageId,
            name,
            layout: []
        };

        return internal
            .doPost('/templates/pages', { body })
            .then(() => dispatch(addPage(body)))
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
                    pages={pages}
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
