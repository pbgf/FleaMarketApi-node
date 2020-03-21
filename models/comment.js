/* jshint indent: 2 */

export default function(sequelize, DataTypes) {
  return sequelize.define('comment', {
    Id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    chat_id: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    like_cnt: {
      type: DataTypes.INTEGER(6),
    },
    publish_user: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    reply_user_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    publish_time: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'comment',
    timestamps: false
  });
};
