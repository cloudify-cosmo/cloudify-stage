import type { DropdownProps } from 'semantic-ui-react';

const { Form } = Stage.Basic;

const t = Stage.Utils.getT('widgets.common.rolesPicker');

export interface RolesPickerProps {
    onUpdate: (name: DropdownProps['name'], value: DropdownProps['value']) => void;
    resources: Record<string, string>;
    resourceName: string;
    toolbox: Stage.Types.WidgetlessToolbox;
}

const RolesPicker = ({ onUpdate, resources, resourceName, toolbox }: RolesPickerProps) => {
    const handleInputChange: DropdownProps['onChange'] = (_proxy, field) => {
        onUpdate(field.name, field.value);
    };

    const roleOptions = _.reverse(
        _.map(_.filter(toolbox.getManagerState().roles, { type: 'tenant_role' }), role => {
            return { text: role.name, value: role.name };
        })
    );

    return (
        <span>
            {_.map(resources, (role, resource) => {
                return (
                    <Form.Field
                        key={resource}
                        label={t('label', {
                            resourceName,
                            resource
                        })}
                    >
                        <Form.Dropdown
                            placeholder={t('placeholder')}
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
