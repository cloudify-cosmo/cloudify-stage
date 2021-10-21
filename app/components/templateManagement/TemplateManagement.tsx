// @ts-nocheck File not migrated fully to TS
/**
 * Created by pposel on 11/08/2017.
 */
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
import { createPageId, setActive } from '../../actions/templateManagement';
import { selectHomePage } from '../../actions/pageMenu';
import Internal from '../../utils/Internal';
import { useBoolean, useErrors } from '../../utils/hooks';
import { addPage, addTemplate, editTemplate, removePage, removeTemplate } from '../../actions/templates';

export default function TemplateManagement() {
    const dispatch = useDispatch();

    const [isLoading, setLoading, unsetLoading] = useBoolean(true);
    const [templates, setTemplates] = useState();
    const [pages, setPages] = useState();
    const { errors, setMessageAsError, clearErrors } = useErrors();

    const internal = useSelector(state => new Internal(state.manager));
    const pageDefs = useSelector(state => state.templates.pagesDef);
    const templateDefs = useSelector(state => state.templates.templatesDef);
    const tenants = useSelector(state => state.manager.tenants);

    function handleError(err) {
        log.error(err);
        setMessageAsError(err);
        unsetLoading();
    }

    function fetchData() {
        return Promise.all([internal.doGet('/templates'), internal.doGet('/templates/pages')])
            .then(data => {
                const selectedTemplate = _.find(templates, { selected: true });
                const selectedPage = _.find(pages, { selected: true });

                const templateList = data[0];
                const pageList = data[1];

                const preparedTemplates = _.map(templateList, template => {
                    return { ...template, pages: templateDefs[template.id].pages };
                });
                if (selectedTemplate) {
                    (_.find(preparedTemplates, { id: selectedTemplate.id }) || {}).selected = true;
                }

                const preparedPages = _.map(pageList, page => {
                    return {
                        ...page,
                        name: (pageDefs[page.id] || {}).name,
                        templates: _.map(
                            _.filter(preparedTemplates, template => _.indexOf(template.pages, page.id) >= 0),
                            'id'
                        )
                    };
                });
                if (selectedPage) {
                    (_.find(preparedPages, { id: selectedPage.id }) || {}).selected = true;
                }

                setTemplates(preparedTemplates);
                setPages(preparedPages);
                clearErrors();
                unsetLoading();
            })
            .catch(handleError);
    }

    useEffect(() => {
        dispatch(setActive(true));
        return () => dispatch(setActive(false));
    }, []);

    useEffect(() => {
        fetchData();
    }, [templateDefs, pageDefs]);

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

        const pageId = createPageId(name, pageDefs);
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
                    <Breadcrumb className="breadcrumbLineHeight">
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
            </Segment>
        </div>
    );
}
