/* jshint indent: 2 */

export default function(sequelize, DataTypes) {
    return sequelize.define('img', {
      Id: {
        type: DataTypes.STRING(32),
        allowNull: false,
        primaryKey: true
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      img_width: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      img_height: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      parent_id: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    }, {
      tableName: 'img',
      timestamps: false
    });
  };
  