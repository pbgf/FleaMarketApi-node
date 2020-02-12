/* jshint indent: 2 */

export default function(sequelize, DataTypes) {
  return sequelize.define('chat', {
    Id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    img: {
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
    like_cnt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    comment_cnt: {
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
    }
  }, {
    tableName: 'chat',
    timestamps: false
  });
};
