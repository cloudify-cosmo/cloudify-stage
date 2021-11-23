import _ from 'lodash';
import React, { FunctionComponent } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import type { ReduxState } from '../../reducers';
import SideBarItem from './SideBarItem';
import StageUtils from '../../utils/stageUtils';
import { useBoolean, useToggle } from '../../utils/hooks';
import SideBarItemIcon from './SideBarItemIcon';
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
            <SideBarItem onClick={toggleExpand} expandable expanded={expanded}>
                <Label
                    style={{ float: 'none', marginLeft: -10, marginTop: -5, marginRight: 9, width: '1.2em' }}
                    circular
                >
                    {username.substr(0, 2)}
                </Label>
                {username}
            </SideBarItem>

            {expanded && (
                <>
                    {canEnterEditMode && (
                        <SideBarItem subItem onClick={handleEditModeClick}>
                            <SideBarItemIcon name="edit" />
                            {t('enterEditMode')}
                        </SideBarItem>
                    )}
                    {canEnterTemplateManagement && (
                        <SideBarItem subItem onClick={() => dispatch(push('/template_management'))}>
                            <SideBarItemIcon name="list layout" />
                            {t('templateManagement')}
                        </SideBarItem>
                    )}
                    <SideBarItem subItem onClick={handleResetModalOpen}>
                        <SideBarItemIcon name="undo" />
                        {t('resetTemplates.label')}
                    </SideBarItem>
                    {canEnterLicenseManagement && (
                        <SideBarItem subItem onClick={() => dispatch(push(Consts.LICENSE_PAGE_PATH))}>
                            <SideBarItemIcon name="key" />
                            {t('licenseManagement')}
                        </SideBarItem>
                    )}
                    {canChangePassword && (
                        <SideBarItem subItem onClick={handlePasswordModalOpen}>
                            <SideBarItemIcon name="lock" />
                            {t('changePassword')}
                        </SideBarItem>
                    )}
                    <SideBarItem subItem onClick={() => dispatch(logout())}>
                        <SideBarItemIcon name="log out" />
                        {t('logout')}
                    </SideBarItem>
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
