/**
 * Created by jakubniezgoda on 02/08/2017.
 */

module.exports = {
    elements: {
        header: 'div.userManagementWidget h5.header',
        loader: 'div.userManagementWidget div.widgetLoader',
        addButton: 'div.userManagementWidget .addUserButton',
        addModal: '.addUserModal',
    },
    sections: {
        usersTable: {
            selector: 'div.userManagementWidget table.usersTable',
            elements: {

            },
            props: {
                userRow : (name) => `tr#usersTable_${name}`,
                userMenu : (name) => `tr#usersTable_${name} td i.content.link.icon`,
                setPasswordOption : 'Set password',
                setRoleOption : 'Set role',
                editTenantsOption : 'Edit user\'s tenants'
            },
            commands: [
                {
                    clickRow: function (userName) {
                        return this.clickElement(this.props.userRow(userName));
                    },

                    setPassword: function (userName) {
                        return this
                            .selectOptionInPopupMenu(this.props.userMenu(userName), this.props.setPasswordOption)
                            .waitForElementVisible(this.parent.section.setPasswordModal.selector);
                    },

                    setRole: function (userName) {
                        return this
                            .selectOptionInPopupMenu(this.props.userMenu(userName), this.props.setRoleOption)
                            .waitForElementVisible(this.parent.section.setRoleModal.selector);
                    },

                    editTenants: function (userName) {
                        return this
                            .selectOptionInPopupMenu(this.props.userMenu(userName), this.props.editTenantsOption)
                            .waitForElementVisible(this.parent.section.editTenantsModal.selector);
                    }
                }
            ],
        },
        editTenantsModal : {
            selector: 'div.editTenantsModal',
            elements: {
                tenantDropdown : 'div[role=\'listbox\']',
                okButton: '.actions button.ok',
                cancelButton: '.actions button.cancel'
            },
            props: {
                tenantTag : (tagName) => `div[role='listbox'] a[value='${tagName}']`,
                editTenantsOption : 'Edit user\'s tenants'
            },
            commands: [
                {
                    addTenant: function (tenant) {
                        return this
                            .log(this.props.tenantTag(tenant))
                            .isPresent(this.props.tenantTag(tenant), (result) => {
                                if (!result.value) {
                                    this.log('Tenant', tenant, 'not present. Adding...')
                                        .selectOptionInDropdown('@tenantDropdown', tenant)
                                        .clickElement('@okButton')
                                        .waitForElementNotPresent(this.selector);
                                } else {
                                    this.log('Tenant', tenant, 'present. Closing modal.')
                                        .clickElement('@cancelButton')
                                        .waitForElementNotPresent(this.selector);
                                }
                            });
                    }
                }
            ],
        },
        setPasswordModal : {
            selector: 'div.userPasswordModal',
            elements: {
                password: '.content input[name="password"]',
                confirmPassword: '.content input[name="confirmPassword"]',
                saveButton: '.actions button.ok',
                cancelButton: '.actions button.cancel'
            },
            commands: [
                {
                    clickSave: function() {
                        return this
                            .clickElement('@saveButton')
                            .waitForElementNotPresent(this.selector);
                    },
                    setPassword: function (password) {
                        return this
                            .resetValue('@password')
                            .setValue('@password', password)
                            .resetValue('@confirmPassword')
                            .setValue('@confirmPassword', password)
                            .clickSave();
                    }
                }
            ],
        },
        setRoleModal : {
            selector: 'div.userRoleModal',
            elements: {
                role: '.content div.field div[role="listbox"]',
                saveButton: '.actions button.ok',
                cancelButton: '.actions button.cancel'
            },
            commands: [
                {
                    clickSave: function() {
                        return this
                            .clickElement('@saveButton')
                            .waitForElementNotPresent(this.selector);
                    },
                    setRole: function (role) {
                        return this
                            .selectOptionInDropdown('@role', role)
                            .clickSave();
                    }
                }
            ],
        },
        addModal: {
            selector: '.addUserModal',
            elements: {
                userName: '.content input[name="username"]',
                password: '.content input[name="password"]',
                confirmPassword: '.content input[name="confirmPassword"]',
                role: '.content div.field div[role="listbox"]',
                okButton: '.actions button.ok',
                cancelButton: '.actions button.cancel',
                loading: 'form.loading'
            },
            props: {
                errorMessage: '.ui.error.message',
                userAlreadyExistError: (userName) => `user ${userName} already exists`
            },
            commands: [
                {
                    fillIn: function(userName, password, role) {
                        return this
                            .waitForElementVisible(this.selector)
                            .setValue('@userName', userName)
                            .setValue('@password', password)
                            .setValue('@confirmPassword', password)
                            .selectOptionInDropdown('@role', role);

                    },
                    clickAdd: function() {
                        return this
                            .clickElement('@okButton')
                            .waitForElementNotPresent('@loading')
                            .isPresent(this.props.errorMessage, result => {
                                if (!result.value) {
                                    this.waitForElementNotPresent(this.selector);
                                }
                            });
                    },
                    clickCancel: function() {
                        return this
                            .clickElement('@cancelButton')
                            .waitForElementNotPresent(this.selector);
                    },
                    performAddition: function (userName, onUserExist, onUserNotExist, onError) {
                        let _ = require('lodash');
                        return this
                            .clickAdd()
                            .isPresent(this.props.errorMessage, result => {
                                if (result.value) {
                                    this.getText(this.props.errorMessage, result => {
                                        if (_.includes(result.value, this.props.userAlreadyExistError(userName))) {
                                            this.log('User', userName, 'already exists.')
                                                .api.perform(() => onUserExist(this));
                                        } else {
                                            this.log('Error during user addition. Error:', result.value)
                                                .api.perform(() => onError(this))
                                            return false;
                                        }
                                    });
                                } else {
                                    this.log('User', userName, 'added.')
                                        .api.perform(() => onUserNotExist(this));
                                }
                            });
                    }
                }
            ]
        },
    },
    props: {
        widgetId: 'userManagement'
    },
    commands: [
        {
            add: function (userName, password, role, tenant) {
                return this
                    .clickElement('@addButton')
                    .section.addModal
                        .fillIn(userName, password, role)
                        .performAddition(userName,
                            (context) => context
                                .clickCancel()
                                .parent.section.usersTable
                                    .setPassword(userName, password)
                                    .parent.section.setPasswordModal
                                        .setPassword(password)
                                .parent.section.usersTable
                                    .setRole(userName, role)
                                    .parent.section.setRoleModal
                                        .setRole(role)
                                .parent.section.usersTable
                                    .editTenants(userName)
                                    .parent.section.editTenantsModal
                                        .addTenant(tenant),
                            (context) => context
                                .parent.section.usersTable
                                    .editTenants(userName)
                                    .parent.section.editTenantsModal
                                        .addTenant(tenant),
                            (context) => {});
            }

        }
    ],
};
