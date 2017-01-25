/**
 * Created by kinneretzin on 26/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class Tenants extends Component {
    static propTypes = {
        manager: PropTypes.object.isRequired,
        onTenantChange: PropTypes.func.isRequired,
        onLogout: PropTypes.func.isRequired,

    };

    onTenantSelected(tenant) {
        this.props.onTenantChange(tenant.name);
    }

    render() {
        if (!this.props.manager.tenants || this.props.manager.tenants.isFetching) {
            return <div className='item ui small active inline loader'></div>
        }

        let selectedTenant = this.props.manager.tenants.selected || _.get(this.props.manager,'tenants.items[0].name');
        return (
            <div className="ui inline dropdown tenantsMenu" ref={select=>$(select).dropdown({action: 'hide'})}>
                <div className="dropDownText text">
                    {selectedTenant ? selectedTenant : 'No Tenants'}
                </div>
                <i className="inverted dropdown icon"></i>
                <div className="menu">
                    {
                        this.props.manager.tenants.items.map((tenant)=>{
                            let isSelected = tenant.name === selectedTenant;
                            return (
                                <div key={tenant.name} className={"item "+ (isSelected ? 'active selected' : '') } onClick={this.onTenantSelected.bind(this,tenant)}>
                                    {tenant.name}
                                </div>
                            );
                        })
                    }
                    <div className='divider'/>
                    <div className='item logout' onClick={this.props.onLogout}>Logout/switch manager</div>
                </div>
            </div>

        );
    }
}

