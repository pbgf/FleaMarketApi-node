/* jshint indent: 2 */

export default function(sequelize, DataTypes) {
    return sequelize.define('deposit', {
      Id: {
        type: DataTypes.STRING(32),
        allowNull: false,
        primaryKey: true
      },
      user: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DOUBLE(10,2)
      },
      state: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    }, {
      tableName: 'deposit',
      timestamps: false
    });
  };
  