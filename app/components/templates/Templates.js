/**
 * Created by pposel on 11/08/2017.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import PageList from './PageList';
import RoleList from './RoleList';
import TenantList from './TenantList';
import CreateTemplateModal from './CreateTemplateModal';
import Const from '../../utils/consts';
import { Segment, Icon, Header, DataTable, PopupConfirm, Label } from '../basic';
import StageUtils from '../../utils/stageUtils';

export default class Templates extends Component {
    static propTypes = {
        templates: PropTypes.array,
        pages: PropTypes.array,
        roles: PropTypes.array,
        tenants: PropTypes.object,
        onSelectTemplate: PropTypes.func,
        onRemoveTemplatePage: PropTypes.func,
        onRemoveTemplateRole: PropTypes.func,
        onRemoveTemplateTenant: PropTypes.func,
        onCreateTemplate: PropTypes.func,
        onModifyTemplate: PropTypes.func,
        onDeleteTemplate: PropTypes.func
    };

    static defaultProps = {
        templates: [],
        pages: [],
        tenants: { items: [] }
    };

    render() {
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

                    {this.props.templates.map(item => {
                        const data = item.data || { roles: [], tenants: [] };
                        const { roles } = data;
                        const { tenants } = data;
                        const tenantsCount =
                            _.indexOf(tenants, Const.DEFAULT_ALL) >= 0
                                ? _.size(this.props.tenants.items)
                                : _.size(tenants);

                        return (
                            <DataTable.RowExpandable key={item.id} expanded={item.selected}>
                                <DataTable.Row
                                    key={item.id}
                                    selected={item.selected}
                                    onClick={() => this.props.onSelectTemplate(item)}
                                >
                                    <DataTable.Data>
                                        <Header as="a" size="small">
                                            {item.id}
                                        </Header>
                                    </DataTable.Data>
                                    <DataTable.Data>
                                        {roles.map((role, index) => (
                                            <span key={role}>
                                                {role === Const.DEFAULT_ALL ? 'all' : role}
                                                {index < roles.length - 1 && <span>, </span>}
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
                                                    trigger={
                                                        <Icon name="remove" link onClick={e => e.stopPropagation()} />
                                                    }
                                                    content="Are you sure to remove this template?"
                                                    onConfirm={() => this.props.onDeleteTemplate(item)}
                                                />
                                                <CreateTemplateModal
                                                    availableTenants={this.props.tenants}
                                                    availablePages={this.props.pages}
                                                    availableRoles={this.props.roles}
                                                    templateName={item.id}
                                                    pages={item.pages}
                                                    roles={roles}
                                                    tenants={tenants}
                                                    onCreateTemplate={(...args) =>
                                                        this.props.onModifyTemplate(item, ...args)
                                                    }
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
                                            onDelete={page => this.props.onRemoveTemplatePage(item, page)}
                                            style={{ width: '33%' }}
                                        />
                                        <RoleList
                                            roles={roles}
                                            custom={item.custom}
                                            onDelete={role => this.props.onRemoveTemplateRole(item, role)}
                                            style={{ width: '33%' }}
                                        />
                                        <TenantList
                                            tenants={tenants}
                                            custom={item.custom}
                                            onDelete={tenant => this.props.onRemoveTemplateTenant(item, tenant)}
                                            style={{ width: '33%' }}
                                        />
                                    </Segment.Group>
                                </DataTable.DataExpandable>
                            </DataTable.RowExpandable>
                        );
                    })}

                    <DataTable.Action>
                        <CreateTemplateModal
                            availableTenants={this.props.tenants}
                            availablePages={this.props.pages}
                            availableRoles={this.props.roles}
                            onCreateTemplate={this.props.onCreateTemplate}
                        />
                    </DataTable.Action>
                </DataTable>
            </Segment>
        );
    }
}
