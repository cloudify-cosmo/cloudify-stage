import type { FunctionComponent } from 'react';
import type { ExtendedUser } from './widget';

interface BasicIsAdminCheckboxProps {
    user: ExtendedUser;
    onAdminUserChange: () => void;
    onDefaultUserChange: () => void;
    disabled?: boolean;
}

const BasicIsAdminCheckbox: FunctionComponent<BasicIsAdminCheckboxProps> = ({
    user,
    disabled = false,
    onAdminUserChange,
    onDefaultUserChange
}) => {
    const { Checkbox } = Stage.Basic;
    return (
        <Checkbox
            checked={user.isAdmin}
            disabled={disabled || user.username === Stage.Common.Consts.adminUsername}
            onChange={() => (user.isAdmin ? onDefaultUserChange() : onAdminUserChange())}
            onClick={e => e.stopPropagation()}
        />
    );
};

interface IsAdminCheckboxProps extends Omit<BasicIsAdminCheckboxProps, 'disabled'> {
    usernameDuringRoleSetting: string;
}

const IsAdminCheckbox: FunctionComponent<IsAdminCheckboxProps> = ({
    user,
    usernameDuringRoleSetting,
    onAdminUserChange,
    onDefaultUserChange
}) => {
    const { Loader, Popup } = Stage.Basic;
    const isUserInAdminGroup = _.has(user.group_system_roles, Stage.Common.Consts.sysAdminRole);
    const isUserAnAdminUser = user.username === Stage.Common.Consts.adminUsername;

    if (usernameDuringRoleSetting === user.username) {
        return <Loader active inline size="mini" />;
    }
    if (isUserInAdminGroup && !isUserAnAdminUser) {
        return (
            <Popup>
                <Popup.Trigger>
                    <BasicIsAdminCheckbox
                        disabled
                        user={user}
                        onAdminUserChange={onAdminUserChange}
                        onDefaultUserChange={onDefaultUserChange}
                    />
                </Popup.Trigger>
                <Popup.Content>
                    To remove the administrator privileges for this user, remove the user from the group that is
                    assigned administrator privileges.
                </Popup.Content>
            </Popup>
        );
    }
    return (
        <BasicIsAdminCheckbox
            user={user}
            onAdminUserChange={onAdminUserChange}
            onDefaultUserChange={onDefaultUserChange}
        />
    );
};
export default IsAdminCheckbox;
