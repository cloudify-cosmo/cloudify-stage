import _ from 'lodash';
import React, { FunctionComponent } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import type { ReduxState } from '../../reducers';
import SideBarItem from './SideBarItem';
import StageUtils from '../../utils/stageUtils';
import { useBoolean, useToggle } from '../../utils/hooks';
import { Label } from '../basic';
import { minimizeWidgets } from '../../actions/widgets';
import { setEditMode } from '../../actions/config';
import Consts from '../../utils/consts';
import ResetPagesModal from '../ResetPagesModal';
import { resetPagesForTenant } from '../../actions/userApp';
import PasswordModal from '../shared/PasswordModal';
import { logout } from '../../actions/managers';

const t = StageUtils.getT('users');

interface UserMenuProps {
    onModalOpen: () => void;
}

const UserMenu: FunctionComponent<UserMenuProps> = ({ onModalOpen }) => {
    const [resetModalVisible, showResetModal, closeResetModal] = useBoolean();
    const [passwordModalVisible, showPasswordModal, closePasswordModal] = useBoolean();
    const [expanded, toggleExpand] = useToggle();
    const dispatch = useDispatch();

    const username = useSelector((state: ReduxState) => state.manager.username);
    const { isUserAuthorized } = StageUtils;
    const canEnterEditMode = useSelector(
        (state: ReduxState) =>
            state.config.mode !== Consts.MODE_CUSTOMER &&
            isUserAuthorized(Consts.permissions.STAGE_EDIT_MODE, state.manager)
    );
    const canEnterTemplateManagement = useSelector(
        (state: ReduxState) =>
            state.config.mode === Consts.MODE_MAIN &&
            isUserAuthorized(Consts.permissions.STAGE_TEMPLATE_MANAGEMENT, state.manager)
    );
    const canEnterLicenseManagement = useSelector(
        (state: ReduxState) =>
            state.config.mode === Consts.MODE_MAIN &&
            isUserAuthorized(Consts.permissions.LICENSE_UPLOAD, state.manager) &&
            state.manager.license.isRequired
    );
    const canChangePassword = useSelector((state: ReduxState) => !state.manager.isLdap);
    const tenantNames = useSelector((state: ReduxState) =>
        state.manager.tenants.items.map((tenant: { name: string }) => tenant.name)
    );

    function handleEditModeClick() {
        onModalOpen();
        dispatch(minimizeWidgets());
        dispatch(setEditMode(true));
    }

    function handleReset(tenantList: string[]) {
        closeResetModal();
        _.forEach(tenantList, tenant => {
            dispatch(resetPagesForTenant(tenant));
        });
    }

    function handleResetModalOpen() {
        onModalOpen();
        showResetModal();
    }

    function handlePasswordModalOpen() {
        onModalOpen();
        showPasswordModal();
    }

    return (
        <>
            <SideBarItem
                icon={
                    <Label
                        style={{ float: 'none', marginLeft: -10, marginTop: -5, marginRight: 9, width: '1.2em' }}
                        circular
                    >
                        {username.substr(0, 2)}
                    </Label>
                }
                label={username}
                onClick={toggleExpand}
                expandable
                expanded={expanded}
            />

            {expanded && (
                <>
                    {canEnterEditMode && (
                        <SideBarItem icon="edit" label={t('enterEditMode')} subItem onClick={handleEditModeClick} />
                    )}
                    {canEnterTemplateManagement && (
                        <SideBarItem
                            icon="list layout"
                            label={t('templateManagement')}
                            subItem
                            onClick={() => dispatch(push('/template_management'))}
                        />
                    )}
                    <SideBarItem icon="undo" label={t('resetTemplates.label')} subItem onClick={handleResetModalOpen} />
                    {canEnterLicenseManagement && (
                        <SideBarItem
                            icon="key"
                            label={t('licenseManagement')}
                            subItem
                            onClick={() => dispatch(push(Consts.LICENSE_PAGE_PATH))}
                        />
                    )}
                    {canChangePassword && (
                        <SideBarItem
                            icon="lock"
                            label={t('changePassword')}
                            subItem
                            onClick={handlePasswordModalOpen}
                        />
                    )}
                    <SideBarItem icon="log out" label={t('logout')} subItem onClick={() => dispatch(logout())} />
                </>
            )}

            <ResetPagesModal
                open={resetModalVisible}
                tenantNames={tenantNames}
                onConfirm={handleReset}
                onHide={closeResetModal}
            />
            <PasswordModal open={passwordModalVisible} onHide={closePasswordModal} />
        </>
    );
};

export default UserMenu;
