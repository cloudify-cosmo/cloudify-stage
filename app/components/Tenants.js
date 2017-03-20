/**
 * Created by kinneretzin on 26/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class Tenants extends Component {
    static propTypes = {
        manager: PropTypes.object.isRequired,
        onTenantChange: PropTypes.func.isRequired
    };

    onTenantSelected(tenant) {
        this.props.onTenantChange(tenant.name);
    }


    render() {
        let {Dropdown, Loader, Icon} = Stage.Basic;

        let tenants = this.props.manager.tenants;
        if (!tenants || !tenants.items || tenants.isFetching) {
            return <Loader active inverted inline size="small" />
        }

        let selectedTenant = tenants.selected || _.get(this.props.manager,'tenants.items[0].name');

        const tenantMenuTrigger = (
            <span>
                <Icon name="male" circular size="small"/>
                <span>{selectedTenant ? selectedTenant : 'No Tenants'}</span>
            </span>
        )

        return (
            <Dropdown pointing="top right" trigger={tenantMenuTrigger} className='tenantsMenu'>
                <Dropdown.Menu>
                    {
                        tenants.items.map((tenant) =>
                            <Dropdown.Item key={tenant.name} text={tenant.name} selected={tenant.name === selectedTenant}
                                           active={tenant.name === selectedTenant}
                                           onClick={this.onTenantSelected.bind(this,tenant)} />
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

