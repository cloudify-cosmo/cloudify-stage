import React from 'react';
import type { DropdownProps } from 'semantic-ui-react';

import { Form } from '../../../components/basic';
import StageUtils from '../../../utils/stageUtils';

const translate = StageUtils.getT('widgets.userGroups.modals.create');

export interface TenantItem {
    name?: string;
    value?: string;
    key?: string;
}

export interface TenantsDropdownProps {
    onChange: (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps & { value?: string[] }) => void;
    value: string[];
    availableTenants?: TenantItem[];
}

const TenantsDropdown = ({ value, availableTenants, onChange }: TenantsDropdownProps) => {
    const availableTenantsOptions = _.map(availableTenants, item => {
        return { text: item.name, value: item.name, key: item.name };
    });

    return (
        <Form.Field label={translate('fields.tenants')}>
            <Form.Dropdown
                name="tenants"
                multiple
                selection
                options={availableTenantsOptions}
                value={value}
                onChange={onChange as DropdownProps['onChange']}
            />
        </Form.Field>
    );
};

export default TenantsDropdown;
