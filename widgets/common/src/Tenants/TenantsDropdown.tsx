// @ts-nocheck File not migrated fully to TS
import { useState } from 'react';

const TenantsDropdown = () => {
    const { Form } = Stage.Basic;
    const [availableTenants, setAvailableTenants] = useState({});
    const [tenants, setTenants] = useState({});

    function handleTenantChange(field) {
        const newTenants = {};
        _.forEach(field.value, tenant => {
            newTenants[tenant] =
                tenants[tenant] || Stage.Common.Roles.Utils.getDefaultRoleName(toolbox.getManagerState().roles);
        });
        setTenants(newTenants);
    }

    const availableTenantsOptions = _.map(availableTenants.items, item => {
        return { text: item.name, value: item.name, key: item.name };
    });

    return (
        <Form.Field label="Tenants">
            <Form.Dropdown
                name="tenants"
                multiple
                selection
                options={availableTenantsOptions}
                value={Object.keys(tenants)}
                onChange={handleTenantChange}
            />
        </Form.Field>
    );
};

export default TenantsDropdown;
