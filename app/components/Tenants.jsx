/**
 * Created by kinneretzin on 26/09/2016.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { HeaderMenu } from 'cloudify-ui-components';

import EventBus from '../utils/EventBus';
import { Dropdown, Icon, Input, Loader } from './basic';

export default class Tenants extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: ''
        };
    }

    componentDidMount() {
        const { onTenantsRefresh } = this.props;
        EventBus.on('menu.tenants:refresh', onTenantsRefresh, this);
    }

    onTenantSelected(tenant) {
        const { onTenantChange } = this.props;
        onTenantChange(tenant.name);
    }

    onSearchChange(value) {
        this.setState({ search: value });
    }

    render() {
        const { manager } = this.props;
        const { search } = this.state;

        const { tenants } = manager;
        if (!tenants || !tenants.items || tenants.isFetching) {
            return <Loader active inverted inline size="small" />;
        }

        const filteredTenants = _(tenants.items)
            .filter(tenant => _.includes(tenant.name, search))
            .sortBy('name')
            .value();
        const selectedTenant = tenants.selected || _.get(tenants, 'items[0].name');

        const tenantMenuTrigger = (
            <>
                <Icon name="male" />
                {selectedTenant || 'No Tenants'}
            </>
        );

        return (
            <HeaderMenu trigger={tenantMenuTrigger} onClose={() => this.onSearchChange('')} className="tenantsMenu">
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
                            onClick={() => this.onTenantSelected(tenant)}
                        />
                    ))}
                </Dropdown.Menu>
            </HeaderMenu>
        );
    }
}

Tenants.propTypes = {
    manager: PropTypes.shape({
        tenants: PropTypes.shape({
            items: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
            isFetching: PropTypes.bool,
            selected: PropTypes.string
        })
    }).isRequired,
    onTenantChange: PropTypes.func.isRequired,
    onTenantsRefresh: PropTypes.func.isRequired
};
