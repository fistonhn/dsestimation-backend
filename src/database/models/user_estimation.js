import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class UserEstimations extends Model {
    static associate(models) {
      // define association here
      UserEstimations.belongsToMany(models.UserMaterials, {
        through: models.UserEstimationLibrary,
        foreignKey: "estimationId",
        as: "materials",
      });
      UserEstimations.belongsToMany(models.UserEquipments, {
        through: models.UserEstimationLibrary,
        foreignKey: "estimationId",
        as: "equipments",
      });

      // labours
      UserEstimations.belongsToMany(models.UserLabours, {
        through: models.UserEstimationLibrary,
        foreignKey: "estimationId",
        as: "labours",
      });

      // sub contractors
      UserEstimations.belongsToMany(models.UserSubContractors, {
        through: models.UserEstimationLibrary,
        foreignKey: "estimationId",
        as: "subContractors",
      });

      // user
      UserEstimations.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        as: "createdBy",
      });

      //  UserEstimationCategory
      UserEstimations.belongsTo(models.UserEstimationCategory, {
        foreignKey: {
          name: "userEstimationCategoryId",
          allowNull: true,
        },
        as: "category",
      });

      // Projects
      UserEstimations.belongsTo(models.Projects, {
        foreignKey: {
          name: "projectId",
          allowNull: true,
        },
        as: "project",
      });

      // UserEstimationConsumption
      UserEstimations.hasMany(models.UserEstimationsConsumption, {
        foreignKey: {
          name: "estimationId",
          allowNull: true,
        },
        as: "estimation_consumed",
      });
    }
  }

  UserEstimations.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        required: true,
      },
      estimationUnit: {
        type: DataTypes.STRING,
        required: true,
      },
      estimationQuantity: {
        type: DataTypes.DECIMAL(100, 2),
        required: true,
      },
      wastagePercentage: {
        type: DataTypes.DECIMAL(100, 2),
      },
      wastageTotal: {
        type: DataTypes.DECIMAL(100, 2),
      },
      transportPercentage: {
        type: DataTypes.DECIMAL(100, 2),
      },
      transportTotal: {
        type: DataTypes.DECIMAL(100, 2),
      },
      profitPercentage: {
        type: DataTypes.DECIMAL(100, 2),
      },
      profitTotal: {
        type: DataTypes.DECIMAL(100, 2),
      },
      overHeadPercentage: {
        type: DataTypes.DECIMAL(100, 2),
      },
      overHeadTotal: {
        type: DataTypes.DECIMAL(100, 2),
      },
      contigencyPercentage: {
        type: DataTypes.DECIMAL(100, 2),
      },
      contigencyTotal: {
        type: DataTypes.DECIMAL(100, 2),
      },
      subtotal: {
        type: DataTypes.DECIMAL(100, 2),
      },
      estimationRate: {
        type: DataTypes.DECIMAL(100, 2),
      },
      estimationTotalAmount: {
        type: DataTypes.DECIMAL(100, 2),
      },
      userEstimationCategoryId: {
        type: DataTypes.INTEGER,
      },
      equipmentCostPerWorkItem: {
        type: DataTypes.DECIMAL(100, 2),
      },
      equipmentRatePerUnit: {
        type: DataTypes.DECIMAL(100, 2),
      },
      materialCostPerWorkItem: {
        type: DataTypes.DECIMAL(100, 2),
      },
      materialRatePerUnit: {
        type: DataTypes.DECIMAL(100, 2),
      },
      indirectCostPerWorkItem: {
        type: DataTypes.DECIMAL(100, 2),
      },
      indirectRatePerUnit: {
        type: DataTypes.DECIMAL(100, 2),
      },
      labourCostperWorkItem: {
        type: DataTypes.DECIMAL(100, 2),
      },
      labourRatePerUnit: {
        type: DataTypes.DECIMAL(100, 2),
      },
      subcontractorCostPerWorkItem: {
        type: DataTypes.DECIMAL(100, 2),
      },
      projectId: {
        type: DataTypes.INTEGER,
      },
      userId: {
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
      modelName: "UserEstimations",
      tableName: "user_estimations",
      timestamps: true,
    }
  );
  return UserEstimations;
};
