import React from 'react';
import type { DropdownProps } from 'semantic-ui-react';
import { map } from 'lodash';
import StageUtils from '../../../utils/stageUtils';

import { Form } from '../../../components/basic';

const translate = StageUtils.getT('widgets.common.rolesPicker');

export type Role = string;

export interface RolesPickerProps {
    onUpdate: (name: string, value: Role) => void;
    resources: Record<string, string>;
    resourceName: string;
    toolbox: Stage.Types.WidgetlessToolbox;
}

const RolesPicker = ({ onUpdate, resources, resourceName, toolbox }: RolesPickerProps) => {
    const handleInputChange: DropdownProps['onChange'] = (_proxy, field) => {
        onUpdate(field.name, field.value as Role);
    };

    const roleOptions = toolbox
        .getManagerState()
        .roles.filter(role => role.type === 'tenant_role')
        .map(role => ({
            text: role.name,
            value: role.name
        }))
        .reverse();

    return (
        <span>
            {map(resources, (role, resource) => {
                return (
                    <Form.Field
                        key={resource}
                        label={translate('label', {
                            resourceName,
                            resource
                        })}
                    >
                        <Form.Dropdown
                            placeholder={translate('placeholder')}
                            selection
                            options={roleOptions}
                            name={resource}
                            value={role}
                            onChange={handleInputChange}
                        />
                    </Form.Field>
                );
            })}
        </span>
    );
};

export default RolesPicker;
