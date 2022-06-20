import type { DropdownProps } from 'semantic-ui-react';

const { Form } = Stage.Basic;

interface TenantItem {
    name?: string;
    value?: string;
    key?: string;
}

export interface TenantsDropdownProps {
    onChange: DropdownProps['onChange'];
    value: string[];
    availableTenants: TenantItem[] | undefined;
}

const TenantsDropdown = ({ value, availableTenants, onChange }: TenantsDropdownProps) => {
    const availableTenantsOptions = _.map(availableTenants, item => {
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
