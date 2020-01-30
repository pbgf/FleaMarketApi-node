/* jshint indent: 2 */

export default function(sequelize, DataTypes) {
  return sequelize.define('user', {
    Id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pass_word: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    telephone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    qq: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'user',
    timestamps: false
  });
};
