// Junction table between library and estimation

import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class UserEstimationLibrary extends Model {
    static associate(models) {
      // define association here
      UserEstimationLibrary.belongsTo(models.Projects, {
        foreignKey: "projectId",
        as: "project",
      });
      UserEstimationLibrary.belongsTo(models.UserEstimations, {
        foreignKey: "estimationId",
        as: "estimation",
      });
      UserEstimationLibrary.belongsTo(models.UserMaterials, {
        foreignKey: "materialId",
        as: "material",
      });
      UserEstimationLibrary.belongsTo(models.UserEquipments, {
        foreignKey: "equipmentId",
        as: "equipment",
      });
      UserEstimationLibrary.belongsTo(models.UserLabours, {
        foreignKey: "labourId",
        as: "labour",
      });
      UserEstimationLibrary.belongsTo(models.UserSubContractors, {
        foreignKey: "subContractorId",
        as: "subcontractor",
      });

    }
  }

  UserEstimationLibrary.init(
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
          model: "UserEstimations",
          key: "id",
        },
      },
      equipmentId: {
        type: DataTypes.INTEGER,
        references: {
          model: "UserEquipments",
          key: "id",
        },
      },
      materialId: {
        type: DataTypes.INTEGER,
        references: {
          model: "UserMaterials",
          key: "id",
        },
      },
      labourId: {
        type: DataTypes.INTEGER,
        references: {
          model: "UserLabours",
          key: "id",
        },
      },
      subContractorId: {
        type: DataTypes.INTEGER,
        references: {
          model: "UserSubContractors",
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
      subContractorTotalAmount: {
        type: DataTypes.DECIMAL(100, 2),
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
      modelName: "UserEstimationLibrary",
      tableName: "user_estimation_library",
      timestamps: false,
    }
  );
  return UserEstimationLibrary;
};
