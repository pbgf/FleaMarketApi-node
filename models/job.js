/* jshint indent: 2 */

export default function(sequelize, DataTypes) {
    return sequelize.define('job', {
      Id: {
        type: DataTypes.STRING(32),
        allowNull: false,
        primaryKey: true
      },
      job_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      job_pay: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      job_detail: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
    //   img_height: {
    //     type: DataTypes.STRING(255),
    //     allowNull: true
    //   },
    //   like_cnt: {
    //     type: DataTypes.STRING(255),
    //     allowNull: true
    //   },
    //   comment_cnt: {
    //     type: DataTypes.STRING(255),
    //     allowNull: true
    //   },
      publish_time: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      publish_user: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    }, {
      tableName: 'job',
      timestamps: false
    });
  };
  