/**
 * Created by jakubniezgoda on 02/08/2017.
 */

module.exports = {
    elements: {
        header: 'div.userManagementWidget > div.widgetItem > h5.header',
        loader: 'div.userManagementWidget div.widgetLoader',
        addButton: 'div.userManagementWidget .addUserButton',
        addModal: '.addUserModal'
    },
    sections: {
        usersTable: {
            selector: 'div.userManagementWidget table.usersTable',
            elements: {},
            props: {
                userRow: name => `tr#usersTable_${name}`,
                userMenu: name => `tr#usersTable_${name} td i.content.link.icon`,
                adminCheckbox: name => `tr#usersTable_${name} td:nth-child(3)`,
                setPasswordOption: 'password',
                editTenantsOption: 'tenants'
            },
            commands: [
                {
                    clickRow(userName) {
                        return this.clickElement(this.props.userRow(userName));
                    },

                    setPassword(userName) {
                        return this.selectOptionInPopupMenu(
                            this.props.userMenu(userName),
                            this.props.setPasswordOption
                        ).waitForElementVisible(this.parent.section.setPasswordModal.selector);
                    },

                    setAdmin(userName, isAdmin) {
                        return this.setCheckbox(this.props.adminCheckbox(userName), isAdmin);
                    },

                    editTenants(userName) {
                        return this.selectOptionInPopupMenu(
                            this.props.userMenu(userName),
                            this.props.editTenantsOption
                        ).waitForElementVisible(this.parent.section.editTenantsModal.selector);
                    }
                }
            ]
        },
        editTenantsModal: {
            selector: 'div.editTenantsModal',
            elements: {
                tenantDropdown: 'div[role="listbox"][name="tenants"]',
                okButton: '.actions button.ok',
                cancelButton: '.actions button.cancel'
            },
            props: {
                tenantTag: tagName => `div[role='listbox'] a[value='${tagName}']`,
                editTenantsOption: 'tenants'
            },
            commands: [
                {
                    addTenant(tenant) {
                        return this.log(this.props.tenantTag(tenant)).isPresent(
                            this.props.tenantTag(tenant),
                            result => {
                                if (!result.value) {
                                    this.log('Tenant', tenant, 'not present. Adding...')
                                        .selectOptionInDropdown(
                                            '@tenantDropdown',
                                            `${this.selector} ${this.elements.tenantDropdown.selector}`,
                                            tenant
                                        )
                                        .clickElement('@okButton')
                                        .waitForElementNotPresent(this.selector);
                                } else {
                                    this.log('Tenant', tenant, 'present. Closing modal.')
                                        .clickElement('@cancelButton')
                                        .waitForElementNotPresent(this.selector);
                                }
                            }
                        );
                    }
                }
            ]
        },
        setPasswordModal: {
            selector: 'div.userPasswordModal',
            elements: {
                password: '.content input[name="password"]',
                confirmPassword: '.content input[name="confirmPassword"]',
                saveButton: '.actions button.ok',
                cancelButton: '.actions button.cancel'
            },
            commands: [
                {
                    clickSave() {
                        return this.clickElement('@saveButton').waitForElementNotPresent(this.selector);
                    },
                    setPassword(password) {
                        return this.resetValue('@password')
                            .setElementValue('@password', password)
                            .resetValue('@confirmPassword')
                            .setElementValue('@confirmPassword', password)
                            .clickSave();
                    }
                }
            ]
        },
        addModal: {
            selector: '.addUserModal',
            elements: {
                userName: '.content input[name="username"]',
                password: '.content input[name="password"]',
                confirmPassword: '.content input[name="confirmPassword"]',
                isAdmin: '.content input[type="checkbox"]',
                okButton: '.actions button.ok',
                cancelButton: '.actions button.cancel',
                loading: 'form.loading'
            },
            props: {
                errorMessage: '.ui.error.message',
                userAlreadyExistError: userName => `user ${userName} already exists`
            },
            commands: [
                {
                    fillIn(userName, password, isAdmin) {
                        return this.waitForElementVisible(this.selector)
                            .setElementValue('@userName', userName)
                            .setElementValue('@password', password)
                            .setElementValue('@confirmPassword', password)
                            .setCheckbox(`${this.selector}`, isAdmin);
                    },
                    clickAdd() {
                        return this.clickElement('@okButton')
                            .waitForElementNotPresent('@loading')
                            .isPresent(this.props.errorMessage, result => {
                                if (!result.value) {
                                    this.waitForElementNotPresent(this.selector);
                                }
                            });
                    },
                    clickCancel() {
                        return this.clickElement('@cancelButton').waitForElementNotPresent(this.selector);
                    },
                    performAddition(userName, onUserExist, onUserNotExist, onError) {
                        const _ = require('lodash');
                        return this.clickAdd().isPresent(this.props.errorMessage, result => {
                            if (result.value) {
                                this.getText(this.props.errorMessage, result => {
                                    if (_.includes(result.value, this.props.userAlreadyExistError(userName))) {
                                        this.log('User', userName, 'already exists.').api.perform(() =>
                                            onUserExist(this)
                                        );
                                    } else {
                                        this.log('Error during user addition. Error:', result.value).api.perform(() =>
                                            onError(this)
                                        );
                                        return false;
                                    }
                                });
                            } else {
                                this.log('User', userName, 'added.').api.perform(() => onUserNotExist(this));
                            }
                        });
                    }
                }
            ]
        }
    },
    props: {
        widgetId: 'userManagement'
    },
    commands: [
        {
            add(userName, password, isAdmin, tenant) {
                return this.clickElement('@addButton')
                    .section.addModal.fillIn(userName, password, isAdmin)
                    .performAddition(
                        userName,
                        context =>
                            context
                                .clickCancel()
                                .parent.section.usersTable.setPassword(userName, password)
                                .parent.section.setPasswordModal.setPassword(password)
                                .parent.section.usersTable.setAdmin(userName, isAdmin)
                                .parent.section.usersTable.editTenants(userName)
                                .parent.section.editTenantsModal.addTenant(tenant),
                        context =>
                            context.parent.section.usersTable
                                .editTenants(userName)
                                .parent.section.editTenantsModal.addTenant(tenant),
                        context => {}
                    );
            }
        }
    ]
};
