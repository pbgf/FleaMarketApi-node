/* jshint indent: 2 */

export default function(sequelize, DataTypes) {
  return sequelize.define('message', {
    Id: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true
    },
    publish_user_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reply_user_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    message_user_id: {
      type: DataTypes.STRING(32),
    },
    chat_id: {
      type: DataTypes.STRING(32),
    },
    comment_id: {
      type: DataTypes.STRING(32),
    },
  }, {
    tableName: 'message',
    timestamps: false
  });
};
