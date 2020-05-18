/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import EventBus from '../utils/EventBus';
import { Dropdown, Icon } from './basic';

export default class Users extends Component {
    static propTypes = {
        manager: PropTypes.object.isRequired,
        showAllOptions: PropTypes.bool.isRequired,
        isEditMode: PropTypes.bool.isRequired,
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
        const { onLogout } = this.props;
        EventBus.on('menu.users:logout', onLogout, this);
    }

    onEditModeClick() {
        const { isEditMode, onEditModeChange } = this.props;
        onEditModeChange(!isEditMode);
    }

    render() {
        const {
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
                        key="log-out"
                        id="logoutMenuItem"
                        icon="log out"
                        text="Logout"
                        value="logout"
                        onClick={onLogout}
                    />
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
