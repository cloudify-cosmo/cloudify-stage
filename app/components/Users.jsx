/**
 * Created by jakubniezgoda on 07/02/2017.
 */
import i18n from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { HeaderMenu } from 'cloudify-ui-components';

import EventBus from '../utils/EventBus';
import { Dropdown, Icon } from './basic';
import PasswordModal from './shared/PasswordModal';

export default class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showPasswordModal: false
        };

        this.onShowChangePasswordModal = this.onShowChangePasswordModal.bind(this);
        this.onHideChangePasswordModal = this.onHideChangePasswordModal.bind(this);
        this.onEditModeClick = this.onEditModeClick.bind(this);
    }

    componentDidMount() {
        const { onLogout } = this.props;
        EventBus.on('menu.users:logout', onLogout, this);
    }

    onShowChangePasswordModal() {
        this.setState({ showPasswordModal: true });
    }

    onHideChangePasswordModal() {
        this.setState({ showPasswordModal: false });
    }

    onEditModeClick = () => {
        const { isEditMode, onEditModeChange } = this.props;
        onEditModeChange(!isEditMode);
    };

    render() {
        const {
            canChangePassword,
            canEditMode,
            canLicenseManagement,
            canTemplateManagement,
            isEditMode,
            manager,
            onLicense,
            onLogout,
            onReset,
            onTemplates,
            showAllOptions
        } = this.props;
        const { showPasswordModal } = this.state;

        const userMenuTrigger = (
            <>
                <Icon name="user" />
                {manager.username}
            </>
        );

        const dropdownItems = [];
        dropdownItems.push();
        dropdownItems.push();
        dropdownItems.push();

        return (
            <>
                <HeaderMenu trigger={userMenuTrigger}>
                    {showAllOptions && canEditMode && (
                        <Dropdown.Item
                            icon="configure"
                            selected={isEditMode}
                            active={isEditMode}
                            text={
                                isEditMode
                                    ? i18n.t('users.exitEditMode', 'Exit Edit Mode')
                                    : i18n.t('users.enterEditMode', 'Edit Mode')
                            }
                            id="editModeMenuItem"
                            value="editMode"
                            onClick={this.onEditModeClick}
                        />
                    )}

                    {showAllOptions && canTemplateManagement && (
                        <Dropdown.Item
                            icon="list layout"
                            text={i18n.t('users.templateManagement', 'Template Management')}
                            value="templates"
                            title={i18n.t('users.templateManagement', 'Template Management')}
                            onClick={onTemplates}
                            id="templatesMenuItem"
                        />
                    )}

                    <Dropdown.Item
                        key="reset"
                        id="resetMenuItem"
                        icon="undo"
                        text={i18n.t('users.resetTemplates.label', 'Reset Templates')}
                        value="reset"
                        title={i18n.t('users.resetTemplates.title', 'Reset application screens')}
                        onClick={onReset}
                    />

                    {showAllOptions && canLicenseManagement && (
                        <Dropdown.Item
                            key="license"
                            id="licenseMenuItem"
                            icon="key"
                            text={i18n.t('users.licenseManagement', 'License Management')}
                            value="license"
                            onClick={onLicense}
                        />
                    )}

                    <Dropdown.Divider key="log-out-divider" />

                    <Dropdown.Item
                        disabled={!canChangePassword}
                        key="change-password"
                        id="changePasswordMenuItem"
                        icon="lock"
                        text={i18n.t('users.changePassword', 'Change Password')}
                        value="change-password"
                        onClick={this.onShowChangePasswordModal}
                    />

                    <Dropdown.Item
                        key="log-out"
                        id="logoutMenuItem"
                        icon="log out"
                        text={i18n.t('users.logout', 'Logout')}
                        value="logout"
                        onClick={onLogout}
                    />
                </HeaderMenu>
                <PasswordModal open={showPasswordModal} onHide={this.onHideChangePasswordModal} />
            </>
        );
    }
}

Users.propTypes = {
    manager: PropTypes.shape({ username: PropTypes.string }).isRequired,
    showAllOptions: PropTypes.bool.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    canChangePassword: PropTypes.bool.isRequired,
    canEditMode: PropTypes.bool.isRequired,
    canTemplateManagement: PropTypes.bool.isRequired,
    canLicenseManagement: PropTypes.bool.isRequired,
    onEditModeChange: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onReset: PropTypes.func,
    onTemplates: PropTypes.func,
    onLicense: PropTypes.func
};

Users.defaultProps = {
    onReset: _.noop,
    onTemplates: _.noop,
    onLicense: _.noop
};
