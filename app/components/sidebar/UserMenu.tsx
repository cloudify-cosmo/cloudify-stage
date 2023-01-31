import _ from 'lodash';
import type { FunctionComponent } from 'react';
import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import type { ReduxState } from '../../reducers';
import SideBarItem from './SideBarItem';
import StageUtils from '../../utils/stageUtils';
import { useBoolean } from '../../utils/hooks';
import { minimizeWidgets } from '../../actions/widgets';
import { setEditMode } from '../../actions/config';
import Consts from '../../utils/consts';
import ResetPagesModal from './ResetPagesModal';
import { resetPagesForTenant } from '../../actions/userApp';
import PasswordModal from '../common/PasswordModal';
import UserInitialsIcon from './UserInitialsIcon';
import type { SystemMenuGroupItemProps } from './SystemMenu';

const t = StageUtils.getT('users');

const UserMenu: FunctionComponent<SystemMenuGroupItemProps> = ({ expanded, onModalOpen, onGroupClick }) => {
    const [resetModalVisible, showResetModal, closeResetModal] = useBoolean();
    const [passwordModalVisible, showPasswordModal, closePasswordModal] = useBoolean();
    const dispatch = useDispatch();

    const username = useSelector((state: ReduxState) => state.manager.auth.username);
    const { isUserAuthorized, Idp } = StageUtils;
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
    const canChangePassword = useSelector(
        (state: ReduxState) =>
            Idp.isLocal(state.manager) || state.manager.auth.username === Consts.DEFAULT_ADMIN_USERNAME
    );
    const tenantNames = useSelector((state: ReduxState) => state.manager.tenants.items!);

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
                icon={<UserInitialsIcon />}
                label={username}
                onClick={onGroupClick}
                expandable
                expanded={expanded}
            />

            {expanded && (
                <>
                    {canEnterEditMode && (
                        <SideBarItem icon="pencil" label={t('enterEditMode')} subItem onClick={handleEditModeClick} />
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
                            onClick={() => dispatch(push(Consts.PAGE_PATH.LICENSE))}
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
                    <SideBarItem
                        icon="log out"
                        label={t('logout')}
                        subItem
                        onClick={() => dispatch(push(Consts.PAGE_PATH.LOGOUT))}
                    />
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
