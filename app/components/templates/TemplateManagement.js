/**
 * Created by pposel on 11/08/2017.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Templates from './Templates';
import Pages from './Pages';
import Const from '../../utils/consts';
import { Breadcrumb, Segment, Divider, ErrorMessage, Button } from '../basic';

export default class TemplateManagement extends Component {
    static propTypes = {
        onTemplatesLoad: PropTypes.func.isRequired,
        onTemplateCreate: PropTypes.func.isRequired,
        onTemplateUpdate: PropTypes.func.isRequired,
        onTemplateDelete: PropTypes.func.isRequired,
        onTemplateSelect: PropTypes.func.isRequired,
        onPageCreate: PropTypes.func.isRequired,
        onPageDelete: PropTypes.func.isRequired,
        onPageEdit: PropTypes.func.isRequired,
        onPagePreview: PropTypes.func.isRequired,
        onPageSelect: PropTypes.func.isRequired,
        onClear: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        templates: PropTypes.array,
        pages: PropTypes.array,
        roles: PropTypes.array
    };

    static defaultProps = {
        templates: [],
        pages: [],
        isLoading: false,
        error: null
    };

    componentDidMount() {
        this.props.onTemplatesLoad();
    }

    componentWillUnmount() {
        this.props.onClear();
    }

    selectTemplate(template) {
        this.props.onTemplateSelect(template.id);
    }

    selectPage(page) {
        this.props.onPageSelect(page.id);
    }

    createTemplate(templateName, roles, tenants, pages) {
        const template = {
            id: templateName.trim(),
            data: {
                roles,
                tenants
            },
            pages
        };

        return this.props.onTemplateCreate(template);
    }

    deleteTemplate(template) {
        this.props.onTemplateDelete(template.id);
    }

    modifyTemplate(item, templateName, roles, tenants, pages) {
        const template = {
            oldId: item.id,
            id: templateName.trim(),
            data: {
                roles,
                tenants: _.isEmpty(tenants) ? [Const.DEFAULT_ALL] : tenants
            },
            pages
        };

        return this.props.onTemplateUpdate(template);
    }

    removeTemplatePage(template, page) {
        template.pages = _.without(template.pages, page);

        this.updateTemplate(template);
    }

    removeTemplateRole(template, role) {
        template.data.roles = _.without(template.data.roles, role);

        this.updateTemplate(template);
    }

    removeTemplateTenant(template, tenant) {
        template.data.tenants = _.without(template.data.tenants, tenant);

        this.updateTemplate(template);
    }

    updateTemplate(template) {
        return this.props.onTemplateUpdate({ ...template, oldId: template.id });
    }

    deletePage(page) {
        this.props.onPageDelete(page.id);
    }

    canDeletePage(page) {
        return _.isEmpty(page.templates) ? null : 'Page is used by the templates and cannot be deleted';
    }

    editPage(page) {
        this.props.onPageEdit(page.id, page.name);
    }

    previewPage(page) {
        this.props.onPagePreview(page.id, page.name);
    }

    render() {
        const { error, isLoading, manager, onClose, onPageCreate, pages, roles, templates } = this.props;
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
                        roles={roles}
                        tenants={manager.tenants}
                        onSelectTemplate={this.selectTemplate.bind(this)}
                        onRemoveTemplatePage={this.removeTemplatePage.bind(this)}
                        onRemoveTemplateRole={this.removeTemplateRole.bind(this)}
                        onRemoveTemplateTenant={this.removeTemplateTenant.bind(this)}
                        onCreateTemplate={this.createTemplate.bind(this)}
                        onModifyTemplate={this.modifyTemplate.bind(this)}
                        onDeleteTemplate={this.deleteTemplate.bind(this)}
                    />

                    <Pages
                        pages={pages}
                        onSelectPage={this.selectPage.bind(this)}
                        onCreatePage={onPageCreate}
                        onDeletePage={this.deletePage.bind(this)}
                        onEditPage={this.editPage.bind(this)}
                        onPreviewPage={this.previewPage.bind(this)}
                        onCanDeletePage={this.canDeletePage.bind(this)}
                    />
                </Segment>
            </div>
        );
    }
}
