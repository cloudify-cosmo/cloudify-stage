import type { DropdownProps, DropdownItemProps } from 'semantic-ui-react';

const { Form } = Stage.Basic;

export interface TenantsDropdownProps {
    onUpdate: DropdownProps['onChange'];
    tenants: Record<string, string>;
    availableTenantsOptions: DropdownItemProps[] | undefined;
}
const TenantsDropdown = ({ onUpdate, tenants, availableTenantsOptions }: TenantsDropdownProps) => {
    return (
        <Form.Field label="Tenants">
            <Form.Dropdown
                name="tenants"
                multiple
                selection
                options={availableTenantsOptions}
                value={Object.keys(tenants)}
                onChange={onUpdate}
            />
        </Form.Field>
    );
};

export default TenantsDropdown;
