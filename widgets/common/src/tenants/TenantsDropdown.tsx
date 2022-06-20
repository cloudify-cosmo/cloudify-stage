import type { DropdownProps } from 'semantic-ui-react';

const { Form } = Stage.Basic;

export interface TenantsDropdownProps {
    onChange: DropdownProps['onChange'];
    value: string[];
    availableTenants: string[] | undefined;
}

const TenantsDropdown = ({ value, availableTenants, onChange }: TenantsDropdownProps) => {
    const availableTenantsOptions = _.map(availableTenants, item => {
        return { text: item, value: item, key: item };
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
