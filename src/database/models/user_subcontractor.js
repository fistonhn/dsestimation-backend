import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class UserSubContractors extends Model {
    static associate(models) {
      // user
      UserSubContractors.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        as: "createdBy",
      });

      UserSubContractors.belongsToMany(models.UserEstimations, {
        through: models.UserEstimationLibrary,
        foreignKey: "subContractorId",
        as: "estimations",
      });

      // projects
      UserSubContractors.belongsTo(models.Projects, {
        foreignKey: {
          name: "projectId",
          allowNull: true,
        },
        as: "subcontractor_project",
      });

      // consumption
      UserSubContractors.hasMany(models.UserSubcontractorConsumption, {
        foreignKey: {
          name: "subContractorId",
          allowNull: false,
        },
        as: "consumed_subcontractor",
      });
      UserSubContractors.hasOne(models.UserEstimationLibrary, {
        foreignKey: "subContractorId",
        as: "subcontractor_calculation",
      });
    }
  }
  UserSubContractors.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      unit: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.DECIMAL,
      },
      price: {
        type: DataTypes.DECIMAL(100, 2),
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
      modelName: "UserSubContractors",
      tableName: "user_subcontractors",
      timestamps: true,
    }
  );
  return UserSubContractors;
};
