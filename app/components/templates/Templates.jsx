/**
 * Created by pposel on 11/08/2017.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import PageList from './PageList';
import RoleList from './RoleList';
import TenantList from './TenantList';
import CreateTemplateModal from './CreateTemplateModal';
import Const from '../../utils/consts';
import { Segment, Icon, Header, DataTable, PopupConfirm, Label } from '../basic';
import StageUtils from '../../utils/stageUtils';

export default function Templates({
    onCreateTemplate,
    onDeleteTemplate,
    onModifyTemplate,
    onRemoveTemplatePage,
    onRemoveTemplateRole,
    onRemoveTemplateTenant,
    onSelectTemplate,
    pages,
    roles,
    templates,
    tenants
}) {
    return (
        <Segment color="blue">
            <Header dividing as="h5">
                Templates
            </Header>

            <DataTable>
                <DataTable.Column label="Template id" width="25%" />
                <DataTable.Column label="Roles" width="25%" />
                <DataTable.Column label="Tenants" width="10%" />
                <DataTable.Column label="Updated at" width="15%" />
                <DataTable.Column label="Updated by" width="15%" />
                <DataTable.Column width="10%" />

                {templates.map(item => {
                    const data = item.data || { roles: [], tenants: [] };
                    const tenantsCount =
                        _.indexOf(data.tenants, Const.DEFAULT_ALL) >= 0 ? _.size(tenants.items) : _.size(data.tenants);

                    return (
                        <DataTable.RowExpandable key={item.id} expanded={item.selected}>
                            <DataTable.Row
                                key={item.id}
                                selected={item.selected}
                                onClick={() => onSelectTemplate(item)}
                            >
                                <DataTable.Data>
                                    <Header as="a" size="small">
                                        {item.id}
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
                                    {item.updatedAt && StageUtils.Time.formatLocalTimestamp(item.updatedAt)}
                                </DataTable.Data>
                                <DataTable.Data>{item.updatedBy}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    {item.custom && (
                                        <div>
                                            <PopupConfirm
                                                trigger={<Icon name="remove" link onClick={e => e.stopPropagation()} />}
                                                content="Are you sure to remove this template?"
                                                onConfirm={() => onDeleteTemplate(item)}
                                            />
                                            <CreateTemplateModal
                                                availableTenants={tenants}
                                                availablePages={pages}
                                                availableRoles={roles}
                                                templateName={item.id}
                                                pages={item.pages}
                                                roles={data.roles}
                                                tenants={data.tenants}
                                                onCreateTemplate={(...args) => onModifyTemplate(item, ...args)}
                                            />
                                        </div>
                                    )}
                                </DataTable.Data>
                            </DataTable.Row>

                            <DataTable.DataExpandable key={item.id}>
                                <Segment.Group horizontal>
                                    <PageList
                                        pages={item.pages}
                                        custom={item.custom}
                                        onDelete={page => onRemoveTemplatePage(item, page)}
                                        style={{ width: '33%' }}
                                    />
                                    <RoleList
                                        roles={data.roles}
                                        custom={item.custom}
                                        onDelete={role => onRemoveTemplateRole(item, role)}
                                        style={{ width: '33%' }}
                                    />
                                    <TenantList
                                        tenants={data.tenants}
                                        custom={item.custom}
                                        onDelete={tenant => onRemoveTemplateTenant(item, tenant)}
                                        style={{ width: '33%' }}
                                    />
                                </Segment.Group>
                            </DataTable.DataExpandable>
                        </DataTable.RowExpandable>
                    );
                })}

                <DataTable.Action>
                    <CreateTemplateModal
                        availableTenants={tenants}
                        availablePages={pages}
                        availableRoles={roles}
                        onCreateTemplate={onCreateTemplate}
                    />
                </DataTable.Action>
            </DataTable>
        </Segment>
    );
}

Templates.propTypes = {
    onCreateTemplate: PropTypes.func,
    onDeleteTemplate: PropTypes.func,
    onModifyTemplate: PropTypes.func,
    onRemoveTemplatePage: PropTypes.func,
    onRemoveTemplateRole: PropTypes.func,
    onRemoveTemplateTenant: PropTypes.func,
    onSelectTemplate: PropTypes.func,
    pages: PropTypes.arrayOf(PropTypes.shape({})),
    roles: PropTypes.arrayOf(PropTypes.shape({})),
    templates: PropTypes.arrayOf(
        PropTypes.shape({
            custom: PropTypes.bool,
            data: PropTypes.shape({
                roles: PropTypes.arrayOf(PropTypes.string),
                tenants: PropTypes.arrayOf(PropTypes.string)
            }),
            id: PropTypes.string,
            pages: PropTypes.arrayOf(PropTypes.string),
            updatedAt: PropTypes.string,
            updatedBy: PropTypes.string
        })
    ),
    tenants: PropTypes.shape({ items: PropTypes.arrayOf(PropTypes.shape({})) })
};

Templates.defaultProps = {
    onCreateTemplate: _.noop,
    onDeleteTemplate: _.noop,
    onModifyTemplate: _.noop,
    onRemoveTemplatePage: _.noop,
    onRemoveTemplateRole: _.noop,
    onRemoveTemplateTenant: _.noop,
    onSelectTemplate: _.noop,
    templates: [],
    pages: [],
    roles: [],
    tenants: { items: [] }
};
