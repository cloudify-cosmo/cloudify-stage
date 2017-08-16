'use strict';

function createUsersTable(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {type: Sequelize.ENUM, values: ['admin','user'], allowNull: false, default: 'user'},
        managerToken: {type: Sequelize.STRING, allowNull: true},

        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }
    }).then(function() {
        return queryInterface.addIndex(
            'Users',
            ['username', 'role', 'managerToken'],
            {
                indicesType: 'UNIQUE'
            }
        );
    });
}

function fillUsersFromUserApps(queryInterface){
    return queryInterface.sequelize.query(`INSERT INTO "Users" (username, role, "createdAt", "updatedAt")
                          SELECT DISTINCT ON(ua.username) ua.username, ua.role::text::"enum_Users_role" , now(), now()
                          FROM "UserApps" ua
                          ORDER BY ua.username, ua."updatedAt" DESC;`);
}

function userAppsChanges(queryInterface, Sequelize){
    let addUserId = () => {
        return queryInterface.addColumn(
            'UserApps', 'userId', {
                type: Sequelize.INTEGER
            }
        );
    };

    let fillUserId = () => {
        return queryInterface.sequelize.query('UPDATE "UserApps" SET "userId" = (SELECT id from "Users" WHERE "UserApps".username = "Users".username)');
    };

    let addNotNullConstraint = () => {
        return queryInterface.changeColumn(
            'UserApps', 'userId', {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        )
    };

    let removeUsername = () => {
        return queryInterface.removeColumn('UserApps', 'username');
    };

    return addUserId()
    .then(() => addUserIdForeignKey(queryInterface, 'UserApps', 'userId'))
    .then(fillUserId)
    .then(addNotNullConstraint)
    .then(removeUsername);
}

function undoUserAppsChanges(queryInterface, Sequelize){
    let addUsername = () => {
        return queryInterface.addColumn(
            'UserApps', 'username', {
                type: Sequelize.STRING
            }
        );
    };

    let fillUsername = () => {
        return queryInterface.sequelize.query('UPDATE "UserApps" SET username = (SELECT username from "Users" WHERE "UserApps"."userId" = "Users".id)');
    };

    let addNotNullConstraint = () => {
        return queryInterface.changeColumn(
            'UserApps', 'username', {
                type: Sequelize.STRING,
                allowNull: false
            }
        )
    };

    let removeUserIdForeignKey = () => {
        return queryInterface.removeConstraint('UserApps', 'UserApps_userId_Users_fk');
    };

    let removeUserId = () => {
        return queryInterface.removeColumn('UserApps', 'userId');
    };

    let reIndex = () => {
        return queryInterface.removeIndex('UserApps', 'user_apps_manager_ip_user_id_role_mode_tenant').then(() => {
            return queryInterface.addIndex(
                'UserApps',
                ['managerIp','username','role','mode'],
                {
                    indicesType: 'UNIQUE'
                }
            )
        });
    };

    return addUsername()
        .then(fillUsername)
        .then(addNotNullConstraint)
        .then(removeUserIdForeignKey)
        .then(removeUserId)
        .then(reIndex);
}

function resourcesChanges(queryInterface, Sequelize){
    let addCreatorId = () => {
        return queryInterface.addColumn(
            'Resources', 'creatorId', {
                type: Sequelize.INTEGER
            }
        );
    };

    let fillCreatorId = () => {
        return queryInterface.sequelize.query('UPDATE "Resources" SET "creatorId" = (SELECT id from "Users" WHERE "Resources".creator = "Users".username)');
    };

    let addNotNullConstraint = () => {
        return queryInterface.changeColumn(
            'Resources', 'creatorId', {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        )
    };

    let removeCreator = () =>{
        return queryInterface.removeColumn('Resources', 'creator');
    };


    return addCreatorId()
        .then(() => addUserIdForeignKey(queryInterface, 'Resources', 'creatorId'))
        .then(fillCreatorId)
        .then(addNotNullConstraint)
        .then(removeCreator);
}

function undoResourcesChanges(queryInterface, Sequelize){
    let addCreator = () => {
        return queryInterface.addColumn(
            'Resources', 'creator', {
                type: Sequelize.STRING,
                allowNull: true
            }
        );
    };

    let fillCreator = () => {
        return queryInterface.sequelize.query('UPDATE "Resources" SET creator = (SELECT username from "Users" WHERE "Resources"."creatorId" = "Users".id)');
    };

    let removeCreatorIdForeignKey = () => {
        return queryInterface.removeConstraint('Resources', 'Resources_creatorId_Users_fk');
    };

    let removeCreatorId = () => {
        return queryInterface.removeColumn('Resources', 'creatorId');
    };

    return addCreator()
        .then(fillCreator)
        .then(removeCreatorIdForeignKey)
        .then(removeCreatorId);
}


function addUserIdForeignKey(queryInterface, table, column){
    return queryInterface.addConstraint(table, [column], {
        type: 'FOREIGN KEY',
        references: {
            table: 'Users',
            field: 'id'
        }
    });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
      return createUsersTable(queryInterface, Sequelize)
      .then(() => {
          return fillUsersFromUserApps(queryInterface)
      }).then(() => {
          return userAppsChanges(queryInterface, Sequelize)
      }).then(() => {
          return resourcesChanges(queryInterface, Sequelize)
      });
  },

  down: (queryInterface, Sequelize) => {
      return undoUserAppsChanges(queryInterface, Sequelize)
      .then(() => {
          return undoResourcesChanges(queryInterface, Sequelize)
      }).then(() => {
          return queryInterface.dropTable('Users');
      });
  }
};
