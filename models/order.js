/* jshint indent: 2 */

export default function(sequelize, DataTypes) {
    return sequelize.define('order', {
      Id: {
        type: DataTypes.STRING(32),
        allowNull: false,
        primaryKey: true
      },
      create_user: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      state: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      merchant: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      money: {
        type: DataTypes.DOUBLE(10,2),
        allowNull: true
      },
      s_id: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      create_time: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
    }, {
      tableName: 'order',
      timestamps: false
    });
  };
  