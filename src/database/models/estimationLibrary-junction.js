// Junction table between library and estimation

import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class EstimationLibrary extends Model {
    static associate(models) {
      // define association here
    }
  }

  EstimationLibrary.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      estimationId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Estimations",
          key: "id",
        },
      },
      equipmentId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Equipments",
          key: "id",
        },
      },
      materialId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Materials",
          key: "id",
        },
      },
      labourId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Labours",
          key: "id",
        },
      },

      subContractorId: {
        type: DataTypes.INTEGER,
        references: {
          model: "SubContractors",
          key: "id",
        },
      },
      equipmentPerformance: {
        type: DataTypes.DECIMAL(100, 2),
      },
      equipmentTotalAmount: {
        type: DataTypes.DECIMAL(100, 2),
      },
      materialFactorQuantity: {
        type: DataTypes.DECIMAL(100, 2),
      },
      materialTotalAmount: {
        type: DataTypes.DECIMAL(100, 2),
      },
      labourFactorQuantity: {
        type: DataTypes.DECIMAL(100, 2),
      },
      labourTotalAmount: {
        type: DataTypes.DECIMAL(100, 2),
      },
      subContractorFactorQty: {
        type: DataTypes.DECIMAL(100, 2),
      },
      subContractorTotalAmount: {
        type: DataTypes.DECIMAL(100, 2),
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
      modelName: "EstimationLibrary",
      tableName: "estimation_library",
      timestamps: false,
    }
  );
  return EstimationLibrary;
};
