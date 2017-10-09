/**
 * Created by jakubniezgoda on 02/08/2017.
 */

exports.command =  function(userName, password, role = 'user - Regular user', tenant = 'default_tenant') {
    return this
        .login()
        .addUser(userName, password, role, tenant)
        .logout();
}