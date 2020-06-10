/**
 * Created by pposel on 11/08/2017.
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import Const from '../../utils/consts';
import { Breadcrumb, Button, Divider, ErrorMessage, Segment } from '../basic';
import Pages from './Pages';
import Templates from './Templates';
import {
    clearTemplateContext,
    createPage,
    createTemplate,
    deletePage,
    deleteTemplate,
    getTemplates,
    selectPage,
    selectTemplate,
    setActive,
    updateTemplate
} from '../../actions/templateManagement';
import { selectHomePage } from '../../actions/page';

export default function TemplateManagement() {
    const dispatch = useDispatch();

    const templateManagement = useSelector(state => state.templateManagement || {});
    const { error, isLoading, templates } = templateManagement;

    const manager = useSelector(state => state.manager);

    useEffect(() => {
        dispatch(getTemplates());
        return () => {
            dispatch(clearTemplateContext());
            dispatch(setActive(false));
        };
    }, []);

    function onSelectTemplate(template) {
        return dispatch(selectTemplate(template.id));
    }

    function onSelectPage(page) {
        return dispatch(selectPage(page.id));
    }

    function onCreateTemplate(templateName, roles, tenants, pages) {
        const template = {
            id: templateName.trim(),
            data: {
                roles,
                tenants
            },
            pages
        };

        return dispatch(createTemplate(template));
    }

    function onDeleteTemplate(template) {
        return dispatch(deleteTemplate(template.id));
    }

    function onModifyTemplate(item, templateName, roles, tenants, pages) {
        const template = {
            oldId: item.id,
            id: templateName.trim(),
            data: {
                roles,
                tenants: _.isEmpty(tenants) ? [Const.DEFAULT_ALL] : tenants
            },
            pages
        };

        return dispatch(updateTemplate(template));
    }

    function onUpdateTemplate(template) {
        return dispatch(updateTemplate({ ...template, oldId: template.id }));
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
        return dispatch(deletePage(page.id));
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

    function onPageCreate(page) {
        return dispatch(createPage(page));
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
                    pages={templateManagement.pages}
                    roles={_.map(manager.roles, role => ({
                        text: role.description ? `${role.name} - ${role.description}` : role.name,
                        value: role.name
                    }))}
                    tenants={manager.tenants}
                    onSelectTemplate={onSelectTemplate}
                    onRemoveTemplatePage={onRemoveTemplatePage}
                    onRemoveTemplateRole={onRemoveTemplateRole}
                    onRemoveTemplateTenant={onRemoveTemplateTenant}
                    onCreateTemplate={onCreateTemplate}
                    onModifyTemplate={onModifyTemplate}
                    onDeleteTemplate={onDeleteTemplate}
                />

                <Pages
                    pages={templateManagement.pages}
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
