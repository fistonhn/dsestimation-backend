import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class UserEstimationCategory extends Model {
    static associate(models) {
      // define association here

      // users
      UserEstimationCategory.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "createdBy",
      });

      // estimations
      UserEstimationCategory.hasMany(models.UserEstimations, {
        foreignKey: {
          name: "userEstimationCategoryId",
          allowNull: false,
        },
        as: "activities",
      });

      // projects
      UserEstimationCategory.belongsTo(models.Projects, {
        foreignKey: {
          name: "projectId",
          allowNull: true,
        },
        as: "project",
      });
    }
  }

  UserEstimationCategory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
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
      modelName: "UserEstimationCategory",
      tableName: "user_estimation_categories",
      timestamps: true,
    }
  );

  return UserEstimationCategory;
};
