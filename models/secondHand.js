/* jshint indent: 2 */

export default function(sequelize, DataTypes) {
    return sequelize.define('secondHand', {
      Id: {
        type: DataTypes.STRING(32),
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      detail: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      publish_time: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      publish_user: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      state: {
        type: DataTypes.INTEGER(1)
      }
      // img: {
      //   type: DataTypes.STRING(255),
      //   allowNull: true
      // },
      // img_width: {
      //   type: DataTypes.STRING(255),
      //   allowNull: true
      // },
      // img_height: {
      //   type: DataTypes.STRING(255),
      //   allowNull: true
      // },
    }, {
      tableName: 'secondHand',
      timestamps: false
    });
  };
  