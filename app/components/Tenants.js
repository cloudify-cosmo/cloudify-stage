/**
 * Created by kinneretzin on 26/09/2016.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import EventBus from '../utils/EventBus';
import { Dropdown, Loader, Icon, Input } from './basic';

export default class Tenants extends Component {
    static propTypes = {
        manager: PropTypes.object.isRequired,
        onTenantChange: PropTypes.func.isRequired,
        onTenantsRefresh: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            search: ''
        };
    }

    componentDidMount() {
        EventBus.on('menu.tenants:refresh', this.props.onTenantsRefresh, this);
    }

    onTenantSelected(tenant) {
        this.props.onTenantChange(tenant.name);
    }

    onSearchChange(value) {
        this.setState({ search: value });
    }

    render() {
        const { tenants } = this.props.manager;
        const { search } = this.state;
        if (!tenants || !tenants.items || tenants.isFetching) {
            return <Loader active inverted inline size="small" />;
        }
        const filteredTenants = _(tenants.items)
            .filter(tenant => _.includes(tenant.name, search))
            .sortBy('name')
            .value();

        const selectedTenant = tenants.selected || _.get(tenants, 'items[0].name');

        const tenantMenuTrigger = (
            <span>
                <Icon name="male" />
                <span>{selectedTenant || 'No Tenants'}</span>
            </span>
        );

        return (
            <Dropdown
                item
                pointing="top right"
                className="tenantsMenu"
                trigger={tenantMenuTrigger}
                onClose={() => this.onSearchChange('')}
            >
                <Dropdown.Menu>
                    <Input
                        icon="search"
                        iconPosition="left"
                        className="search"
                        value={search}
                        onClick={e => e.stopPropagation()}
                        onChange={(e, { value }) => {
                            e.stopPropagation();
                            this.onSearchChange(value);
                        }}
                    />
                    <Dropdown.Menu scrolling>
                        {filteredTenants.map(tenant => (
                            <Dropdown.Item
                                key={tenant.name}
                                text={tenant.name}
                                selected={tenant.name === selectedTenant}
                                active={tenant.name === selectedTenant}
                                onClick={this.onTenantSelected.bind(this, tenant)}
                            />
                        ))}
                    </Dropdown.Menu>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
