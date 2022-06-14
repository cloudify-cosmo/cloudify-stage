import type { DropdownProps } from 'semantic-ui-react';

const { Form } = Stage.Basic;

export interface TenantsDropdownProps {
    onUpdate: (proxy: any, field: { value?: any }) => void;
    tenants: any;
    availableTenantsOptions: any;
}
const TenantsDropdown = ({ onUpdate, tenants, availableTenantsOptions }: TenantsDropdownProps) => {
    const handleInputChange: DropdownProps['onChange'] = (_proxy, field) => {
        onUpdate(_proxy, field);
    };

    return (
        <Form.Field label="Tenants">
            <Form.Dropdown
                name="tenants"
                multiple
                selection
                options={availableTenantsOptions}
                value={Object.keys(tenants)}
                onChange={handleInputChange}
            />
        </Form.Field>
    );
};

export default TenantsDropdown;
