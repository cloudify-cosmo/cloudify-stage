/**
 * Created by pposel on 11/08/2017.
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import Const from '../../utils/consts';
import { Breadcrumb, Button, Divider, ErrorMessage, Segment } from '../basic';
import Pages from './Pages';
import Templates from './Templates';
import { createPageId, setActive } from '../../actions/templateManagement';
import { selectHomePage } from '../../actions/page';
import Internal from '../../utils/Internal';
import { addPage, addTemplate, editTemplate, removePage, removeTemplate } from '../../actions/templates';

export default function TemplateManagement() {
    const dispatch = useDispatch();

    const [isLoading, setLoading] = useState(true);
    const [templates, setTemplates] = useState();
    const [pages, setPages] = useState();
    const [error, setError] = useState();

    const internal = useSelector(state => new Internal(state.manager));
    const pageDefs = useSelector(state => state.templates.pagesDef);
    const templateDefs = useSelector(state => state.templates.templatesDef);
    const tenants = useSelector(state => state.manager.tenants);
    const roles = useSelector(state => state.manager.roles);

    function handleError(err) {
        log.error(err);
        setError(err.message);
        setLoading(false);
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
                setError(null);
                setLoading(false);
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
        setLoading(true);
        setError(null);
    }

    function onCreateTemplate(templateName, templateRoles, templateTenants, templatePages) {
        startLoading();

        const template = {
            id: templateName.trim(),
            data: {
                roles: templateRoles,
                tenants: templateTenants
            },
            pages: templatePages
        };

        return internal
            .doPost('/templates', {}, template)
            .then(() => dispatch(addTemplate(template.id, template.pages)))
            .catch(handleError);
    }

    function onDeleteTemplate(template) {
        startLoading();

        return internal
            .doDelete(`/templates/${template.id}`)
            .then(() => dispatch(removeTemplate(template.id)))
            .catch(handleError);
    }

    function updateTemplate(template) {
        startLoading();

        return internal
            .doPut('/templates', {}, template)
            .then(() => {
                dispatch(editTemplate(template.id, template.pages));
                if (template.oldId && template.oldId !== template.id) {
                    dispatch(removeTemplate(template.oldId));
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

    function onRemoveTemplatePage(template, page) {
        template.pages = _.without(template.pages, page);

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
        return _.isEmpty(page.templates) ? null : 'Page is used by the templates and cannot be deleted';
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
        const page = {
            id: pageId,
            name,
            widgets: []
        };

        return internal
            .doPost('/templates/pages', {}, page)
            .then(() => dispatch(addPage(page)))
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
                        <Breadcrumb.Section active>Template management</Breadcrumb.Section>
                    </Breadcrumb>
                    <Button
                        content="Close"
                        basic
                        compact
                        floated="right"
                        icon="sign out"
                        onClick={onClose}
                        style={{ position: 'absolute', right: 0 }}
                    />
                </div>
                <Divider />

                <ErrorMessage error={error} />

                <Templates
                    templates={templates}
                    pages={pages}
                    roles={_.map(roles, role => ({
                        text: role.description ? `${role.name} - ${role.description}` : role.name,
                        value: role.name
                    }))}
                    tenants={tenants}
                    onSelectTemplate={onSelectTemplate}
                    onRemoveTemplatePage={onRemoveTemplatePage}
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
