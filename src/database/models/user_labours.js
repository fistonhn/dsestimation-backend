import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class UserLabours extends Model {
    static associate(models) {
      // user
      UserLabours.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        as: "createdBy",
      });

      UserLabours.belongsToMany(models.UserEstimations, {
        through: models.UserEstimationLibrary,
        foreignKey: "labourId",
        as: "estimations",
      });

      UserLabours.belongsTo(models.Projects, {
        foreignKey: {
          name: "projectId",
          allowNull: true,
        },
        as: "labours_project",
      });

      // UserEstimationLibrary
      UserLabours.hasOne(models.UserEstimationLibrary, {
        foreignKey: "labourId",
        as: "labour_calculation",
      });

      // consumption
      UserLabours.hasMany(models.UserLabourConsumption, {
        foreignKey: {
          name: "labourId",
          allowNull: false,
        },
        as: "consumed_labour",
      });
    }
  }

  UserLabours.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      unit: {
        type: DataTypes.STRING,
      },
      wages: {
        type: DataTypes.INTEGER,
      },
      caveragePerUnit: {
        type: DataTypes.DECIMAL,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      projectId: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "UserLabours",
      tableName: "user_labours",
      timestamps: true,
    }
  );
  return UserLabours;
};
