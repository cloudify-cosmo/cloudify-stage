'use strict';

function createClientConfigs (queryInterface,Sequelize) {
  return queryInterface.createTable('ClientConfigs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    managerIp: {
      type: Sequelize.STRING,
      allowNull: false
    },
    config: {
      type: Sequelize.JSON,
      allowNull: false
    },
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
        'ClientConfigs',
        ['managerIp'],
        {
          indicesType: 'UNIQUE'
        }
    )
  });
}

function createUserAppModel (queryInterface,Sequelize) {
  return queryInterface.createTable('UserApps', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },



    managerIp : {type: Sequelize.STRING, allowNull: false },
    username: { type: Sequelize.STRING, allowNull: false},
    appDataVersion: {type: Sequelize.INTEGER, allowNull: false},
    mode: {type: Sequelize.ENUM, values: ['customer','main'], allowNull: false, default: 'main'},
    role: {type: Sequelize.ENUM, values: ['admin','user'], allowNull: false, default: 'user'},
    appData: { type: Sequelize.JSON,allowNull: false},

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
        'UserApps',
        ['managerIp','username','role','mode'],
        {
          indicesType: 'UNIQUE'
        }
    )
  });
}

function createBlueprintAdditionsModel (queryInterface,Sequelize) {
  return queryInterface.createTable('BlueprintAdditions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    blueprintId : {type: Sequelize.STRING, allowNull: false },
    image: { type: Sequelize.BLOB, allowNull: true},
    imageUrl: { type: Sequelize.STRING, allowNull: true},

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
        'BlueprintAdditions',
        ['blueprintId'],
        {
          indicesType: 'UNIQUE'
        }
    )
  });
}

function createApplicationModel (queryInterface,Sequelize) {
  return queryInterface.createTable('Applications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: { type: Sequelize.INTEGER },
    isPrivate: { type: Sequelize.BOOLEAN },
    extras: { type: Sequelize.JSON },

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
        'Applications',
        ['id'],
        {
          indicesType: 'UNIQUE'
        }
    )
  });
}

module.exports = {
  up: function(queryInterface, Sequelize) {
    return createClientConfigs(queryInterface,Sequelize).then(function(){
      return createUserAppModel(queryInterface,Sequelize);
    }).then(function(){
      return createBlueprintAdditionsModel(queryInterface,Sequelize);
    }).then(function(){
      return createApplicationModel(queryInterface,Sequelize);
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('ClientConfigs').then(function(){
      return queryInterface.dropTable('UserApps');
    }).then(function(){
      return queryInterface.dropTable('BlueprintAdditions');
    }).then(function(){
      return queryInterface.dropTable('Applications');
    });
  }
};