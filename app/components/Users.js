/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

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

    static propTypes = {
        manager: PropTypes.object.isRequired,
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

    componentDidMount() {
        EventBus.on('menu.users:logout', this.props.onLogout, this);
    }

    onShowChangePasswordModal() {
        this.setState({ showPasswordModal: true });
    }

    onHideChangePasswordModal() {
        this.setState({ showPasswordModal: false });
    }

    onEditModeClick() {
        this.props.onEditModeChange(!this.props.isEditMode);
    }

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
            <span>
                <Icon name="user" />
                <span>{manager.username}</span>
            </span>
        );

        const dropdownItems = [];
        dropdownItems.push();
        dropdownItems.push();
        dropdownItems.push();

        return (
            <>
                <Dropdown item pointing="top right" trigger={userMenuTrigger} className="usersMenu">
                    <Dropdown.Menu>
                        {showAllOptions && canEditMode && (
                            <Dropdown.Item
                                icon="configure"
                                selected={isEditMode}
                                active={isEditMode}
                                text={isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
                                id="editModeMenuItem"
                                value="editMode"
                                onClick={this.onEditModeClick.bind(this)}
                            />
                        )}

                        {showAllOptions && canTemplateManagement && (
                            <Dropdown.Item
                                icon="list layout"
                                text="Template Management"
                                value="templates"
                                title="Template management"
                                onClick={onTemplates}
                                id="templatesMenuItem"
                            />
                        )}

                        <Dropdown.Item
                            key="reset"
                            id="resetMenuItem"
                            icon="undo"
                            text="Reset Templates"
                            value="reset"
                            title="Reset application screens"
                            onClick={onReset}
                        />

                        {showAllOptions && canLicenseManagement && (
                            <Dropdown.Item
                                key="license"
                                id="licenseMenuItem"
                                icon="key"
                                text="License Management"
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
                            text="Change Password"
                            value="change-password"
                            onClick={this.onShowChangePasswordModal}
                        />

                        <Dropdown.Item
                            key="log-out"
                            id="logoutMenuItem"
                            icon="log out"
                            text="Logout"
                            value="logout"
                            onClick={onLogout}
                        />
                    </Dropdown.Menu>
                </Dropdown>
                <PasswordModal open={showPasswordModal} onHide={this.onHideChangePasswordModal} />
            </>
        );
    }
}
