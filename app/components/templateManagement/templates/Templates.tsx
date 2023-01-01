import React from 'react';
import type { PageItem, Template as BackendTemplate } from 'backend/handler/templates/types';
import PageMenuItemsList from './PageMenuItemsList';
import RoleList from './RoleList';
import TenantList from './TenantList';
import type { CreateTemplateModalProps } from './CreateTemplateModal';
import CreateTemplateModal from './CreateTemplateModal';
import Const from '../../../utils/consts';
import { Button, DataTable, Header, Icon, Label, PopupConfirm, Segment } from '../../basic';
import StageUtils from '../../../utils/stageUtils';

import type { TenantsData } from '../../../reducers/managerReducer/tenantsReducer';

const tTemplates = StageUtils.getT('templates');
const tTemplateManagement = StageUtils.composeT(tTemplates, 'templateManagement');

export type Template = BackendTemplate & { pages: PageItem[]; selected: boolean };

export interface TemplatesProps {
    onCreateTemplate: CreateTemplateModalProps['onCreateTemplate'];
    onDeleteTemplate: (template: Template) => void;
    onModifyTemplate: (
        item: Template,
        templateName: string,
        templateRoles: string[],
        templateTenants: string[],
        templatePages: PageItem[]
    ) => Promise<void>;
    onRemoveTemplatePage: (template: Template, pageMenuItem: PageItem) => Promise<void>;
    onRemoveTemplateRole: (template: Template, role: string) => Promise<void>;
    onRemoveTemplateTenant: (template: Template, tenant: string) => Promise<void>;
    onSelectTemplate: (template: Template) => void;
    templates: Template[];
    tenants: TenantsData;
}
export default function Templates({
    onCreateTemplate,
    onDeleteTemplate,
    onModifyTemplate,
    onRemoveTemplatePage,
    onRemoveTemplateRole,
    onRemoveTemplateTenant,
    onSelectTemplate,
    templates = [],
    tenants = { items: [] }
}: TemplatesProps) {
    return (
        <Segment color="blue">
            <Header dividing as="h5">
                {tTemplates('templates')}
            </Header>

            <DataTable>
                <DataTable.Column label={tTemplateManagement('table.templateId')} width="25%" />
                <DataTable.Column label={tTemplateManagement('table.roles')} width="25%" />
                <DataTable.Column label={tTemplateManagement('table.tenants')} width="10%" />
                <DataTable.Column label={tTemplateManagement('table.updatedAt')} width="15%" />
                <DataTable.Column label={tTemplateManagement('table.updatedBy')} width="15%" />
                <DataTable.Column width="10%" />

                {templates.map(template => {
                    const data = template.data || { roles: [], tenants: [] };
                    const tenantsCount =
                        _.indexOf(data.tenants, Const.DEFAULT_ALL) >= 0 ? _.size(tenants.items) : _.size(data.tenants);

                    return (
                        <DataTable.RowExpandable key={template.id} expanded={template.selected}>
                            <DataTable.Row
                                key={template.id}
                                selected={template.selected}
                                onClick={() => onSelectTemplate(template)}
                            >
                                <DataTable.Data>
                                    <Header as="a" size="small">
                                        {template.id}
                                    </Header>
                                </DataTable.Data>
                                <DataTable.Data>
                                    {data.roles.map((role, index) => (
                                        <span key={role}>
                                            {role === Const.DEFAULT_ALL ? 'all' : role}
                                            {index < data.roles.length - 1 && <span>, </span>}
                                        </span>
                                    ))}
                                </DataTable.Data>
                                <DataTable.Data>
                                    <Label color="green" horizontal>
                                        {tenantsCount}
                                    </Label>
                                </DataTable.Data>
                                <DataTable.Data>
                                    {template.updatedAt && StageUtils.Time.formatLocalTimestamp(template.updatedAt)}
                                </DataTable.Data>
                                <DataTable.Data>{template.updatedBy}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    {template.custom && (
                                        <div>
                                            <PopupConfirm
                                                trigger={
                                                    <Icon
                                                        name="remove"
                                                        link
                                                        onClick={(event: Event) => event.stopPropagation()}
                                                    />
                                                }
                                                content={tTemplateManagement('removeConfirm')}
                                                onConfirm={() => onDeleteTemplate(template)}
                                            />
                                            <CreateTemplateModal
                                                initialTemplateName={template.id}
                                                initialPageMenuItems={template.pages}
                                                initialRoles={data.roles}
                                                initialTenants={data.tenants}
                                                onCreateTemplate={(...args) => onModifyTemplate(template, ...args)}
                                                trigger={
                                                    <Icon
                                                        name="edit"
                                                        link
                                                        className="updateTemplateIcon"
                                                        onClick={(event: Event) => event.stopPropagation()}
                                                    />
                                                }
                                            />
                                        </div>
                                    )}
                                </DataTable.Data>
                            </DataTable.Row>

                            <DataTable.DataExpandable key={template.id}>
                                <Segment.Group horizontal>
                                    <PageMenuItemsList
                                        pages={template.pages}
                                        custom={template.custom}
                                        onDelete={page => onRemoveTemplatePage(template, page)}
                                        style={{ width: '33%' }}
                                    />
                                    <RoleList
                                        roles={data.roles}
                                        custom={template.custom}
                                        onDelete={role => onRemoveTemplateRole(template, role)}
                                        style={{ width: '33%' }}
                                    />
                                    <TenantList
                                        tenants={data.tenants}
                                        custom={template.custom}
                                        onDelete={tenant => onRemoveTemplateTenant(template, tenant)}
                                        style={{ width: '33%' }}
                                    />
                                </Segment.Group>
                            </DataTable.DataExpandable>
                        </DataTable.RowExpandable>
                    );
                })}

                <DataTable.Action>
                    <CreateTemplateModal
                        onCreateTemplate={onCreateTemplate}
                        trigger={
                            <Button
                                content={tTemplateManagement('addTemplateButton')}
                                icon="list layout"
                                labelPosition="left"
                                className="createTemplateButton"
                            />
                        }
                    />
                </DataTable.Action>
            </DataTable>
        </Segment>
    );
}
