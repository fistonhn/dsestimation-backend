import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Estimations extends Model {
    static associate(models) {
      // define association here
      Estimations.belongsToMany(models.Materials, {
        through: models.EstimationLibrary,
        foreignKey: "estimationId",
        as: "materials",
      });
      Estimations.belongsToMany(models.Equipments, {
        through: models.EstimationLibrary,
        foreignKey: "estimationId",
        as: "equipments",
      });

      // labours
      Estimations.belongsToMany(models.Labours, {
        through: models.EstimationLibrary,
        foreignKey: "estimationId",
        as: "labours",
      });

      // sub contractors
      Estimations.belongsToMany(models.SubContractors, {
        through: models.EstimationLibrary,
        foreignKey: "estimationId",
        as: "subContractors",
      });

      // user
      Estimations.belongsTo(models.Users, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "createdBy",
      });

      //  EstimationCategory
      Estimations.belongsTo(models.EstimationCategory, {
        foreignKey: {
          name: "estimationCategoryId",
          allowNull: true,
        },
        as: "category",
      });
    }
  }

  Estimations.init(
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
      estimationCategoryId: {
        type: DataTypes.INTEGER,
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
      userId: {
        type: DataTypes.INTEGER,
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      modelName: "Estimations",
      tableName: "estimations",
      timestamps: true,
    }
  );
  return Estimations;
};
