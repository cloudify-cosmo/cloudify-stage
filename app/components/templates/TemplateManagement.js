/**
 * Created by pposel on 11/08/2017.
 */

import React, { Component, PropTypes } from 'react';
import Templates from './Templates';
import Pages from './Pages';
import Const from '../../utils/consts';

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
    }

    componentDidMount() {
        this.props.onTemplatesLoad();
    }

    componentWillUnmount() {
        this.props.onClear();
    }

    _selectTemplate(template) {
        this.props.onTemplateSelect(template.id);
    }

    _selectPage(page) {
        this.props.onPageSelect(page.id);
    }

    _createTemplate(templateName, roles,  tenants, pages) {
        var template = {
            id: templateName.trim(),
            data: {
                roles,
                tenants
            },
            pages
        };

        return this.props.onTemplateCreate(template);
    }

    _deleteTemplate(template) {
        this.props.onTemplateDelete(template.id);
    }

    _modifyTemplate(item, templateName, roles,  tenants, pages) {
        var template = {
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

    _removeTemplatePage(template, page) {
        template.pages = _.without(template.pages, page);

        this._updateTemplate(template);
    }

    _removeTemplateRole(template, role) {
        template.data.roles = _.without(template.data.roles, role);

        this._updateTemplate(template);
    }

    _removeTemplateTenant(template, tenant) {
        template.data.tenants = _.without(template.data.tenants, tenant);

        this._updateTemplate(template);
    }

    _updateTemplate(template) {
        return this.props.onTemplateUpdate({...template, oldId: template.id});
    }

    _deletePage(page) {
        this.props.onPageDelete(page.id);
    }

    _canDeletePage(page) {
        return _.isEmpty(page.templates) ? null : 'Page is used by the templates and cannot be deleted';
    }

    _editPage(page) {
        this.props.onPageEdit(page.id, page.name);
    }

    _previewPage(page) {
        this.props.onPagePreview(page.id, page.name);
    }

    render () {
        let {Breadcrumb, Segment, Divider, ErrorMessage, Button} = Stage.Basic;

        return (
            <div className='main'>
                <Segment basic loading={this.props.isLoading}>
                    <div>
                        <Breadcrumb className="breadcrumbLineHeight">
                            <Breadcrumb.Section active>Template management</Breadcrumb.Section>
                        </Breadcrumb>
                        <Button content="Close" basic compact floated="right" icon='sign out' onClick={this.props.onClose}/>
                    </div>
                    <Divider/>

                    <ErrorMessage error={this.props.error}/>

                    <Templates templates={this.props.templates} pages={this.props.pages} roles={this.props.roles}
                               tenants={this.props.manager.tenants}
                               onSelectTemplate={this._selectTemplate.bind(this)}
                               onRemoveTemplatePage={this._removeTemplatePage.bind(this)}
                               onRemoveTemplateRole={this._removeTemplateRole.bind(this)}
                               onRemoveTemplateTenant={this._removeTemplateTenant.bind(this)}
                               onCreateTemplate={this._createTemplate.bind(this)}
                               onModifyTemplate={this._modifyTemplate.bind(this)}
                               onDeleteTemplate={this._deleteTemplate.bind(this)}
                    />

                    <Pages pages={this.props.pages}
                           onSelectPage={this._selectPage.bind(this)}
                           onCreatePage={this.props.onPageCreate}
                           onDeletePage={this._deletePage.bind(this)}
                           onEditPage={this._editPage.bind(this)}
                           onPreviewPage={this._previewPage.bind(this)}
                           onCanDeletePage={this._canDeletePage.bind(this)}/>

                </Segment>
            </div>
        );
    }
}
