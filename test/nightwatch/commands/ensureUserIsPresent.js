/**
 * Created by jakubniezgoda on 02/08/2017.
 */

exports.command =  function(userName, password, isAdmin = false, tenant = 'default_tenant') {
    return this
        .login()
        .addUser(userName, password, isAdmin, tenant)
        .logout();
}