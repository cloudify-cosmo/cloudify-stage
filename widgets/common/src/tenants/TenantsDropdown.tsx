import type { DropdownProps } from 'semantic-ui-react';

const { Form } = Stage.Basic;

export interface TenantsDropdownProps {
    onChange: DropdownProps['onChange'];
    value: string[];
    availableTenants: AvailableTenants | undefined;
}

interface TenantItem {
    name?: string;
    value?: string;
    key?: string;
}

interface AvailableTenants {
    items: TenantItem[];
}

const TenantsDropdown = ({ value, availableTenants, onChange }: TenantsDropdownProps) => {
    const availableTenantsOptions = _.map(availableTenants?.items, item => {
        return { text: item.name, value: item.name, key: item.name };
    });

    return (
        <Form.Field label="Tenants">
            <Form.Dropdown
                name="tenants"
                multiple
                selection
                options={availableTenantsOptions}
                value={value}
                onChange={onChange}
            />
        </Form.Field>
    );
};

export default TenantsDropdown;
